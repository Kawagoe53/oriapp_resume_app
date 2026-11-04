"use client";

import { actionButtonVariants } from "@/app/_components/ui/actionButtonVariants";
import useDeleteResume from "@/app/_hooks/useDeleteResume";
import useFetch from "@/app/_hooks/useFetch";
import { getDefaultResumeTitle } from "@/app/_libs/resumeTitle";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  MAX_JOB_EXPERIENCES,
  MIN_JOB_EXPERIENCES,
  ResumeEditFormData,
  resumeEditSchema,
} from "@/app/_schemas/resumeEditSchema";
import { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { UpdateResumeRequestBody } from "@/app/_types/edit";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import CertificateFields from "./_components/CertificateFields";
import EducationFields from "./_components/EducationFields";
import JobExperienceFields from "./_components/JobExperienceFields";
import PersonalInformationFields from "./_components/PersonalInformationFields";
import SkillsFields from "./_components/SkillsFields";
import SummaryFields from "./_components/SummaryFields";

export default function EditPage() {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const { deleteResume, deletingId, deleteError } = useDeleteResume();
  const [deleted, setDeleted] = useState(false);
  const isDeleting = deletingId !== null || deleted;
  const { token } = useSupabaseSession();

  const {
    data: resumeResponse,
    error,
    isLoading,
  } = useFetch<ResumeShowResponse>(`/api/resumes/${id}`);

  const methods = useForm<ResumeEditFormData>({
    resolver: zodResolver(resumeEditSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const {
    fields: skillFields, //元々入っている配列
    append: appendSkill, //配列の要素を追加する関数
    remove: removeSkill, //配列の要素を削除する関数
  } = useFieldArray({
    control, //react-hook-formのcontrolを渡す
    name: "skills", //フォームの中の配列の名前
  });

  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate,
  } = useFieldArray({
    control,
    name: "certificate",
  });

  const {
    fields: jobExperienceFields,
    append: appendJobExperience,
    remove: removeJobExperience,
  } = useFieldArray({
    control,
    name: "jobExperiences",
  });

  //APIから取得した履歴書を、編集フォームで使える形に変換してセットする処理
  useEffect(() => {
    if (!resumeResponse) return;

    const resume = resumeResponse.resume;

    reset({
      title: resume.title?.trim() || getDefaultResumeTitle(resume.jobType),
      fullName: resume.fullName ?? "",
      email: resume.email ?? "",
      phone: resume.phone ?? "",
      address: resume.address ?? "",
      visaInfo: resume.visaInfo ?? "",
      availability: resume.availability ?? "",

      summary: resume.summary ?? "",

      educationSchool: resume.educationSchool ?? "",
      educationMajor: resume.educationMajor ?? "",
      educationYear: resume.educationYear ? String(resume.educationYear) : "",

      skills: Array.isArray(resume.skills)
        ? resume.skills.map((skill) => ({ value: String(skill) }))
        : [],

      certificate: Array.isArray(resume.certificate)
        ? resume.certificate.map((certificate) => ({
            value: String(certificate),
          }))
        : [],

      jobExperiences:
        resume.jobExperiences.length === 0
          ? [
              {
                companyName: "",
                position: "",
                jobType: "",
                startDate: "",
                endDate: "",
                description: [],
              },
            ]
          : resume.jobExperiences.map((experience) => ({
              companyName: experience.companyName,
              position: experience.position,
              jobType: experience.jobType,
              startDate: new Date(experience.startDate)
                .toISOString()
                .split("T")[0],
              endDate: experience.endDate
                ? new Date(experience.endDate).toISOString().split("T")[0]
                : "",
              description: Array.isArray(experience.description)
                ? experience.description.map((description) => ({
                    value: String(description),
                  }))
                : [],
            })),
    });
  }, [resumeResponse, reset]);

  const onSubmit = async (data: ResumeEditFormData) => {
    if (!token || isDeleting) {
      return;
    }

    const resume = resumeResponse?.resume;

    if (!resume) {
      return;
    }

    setSaveError(null);
    try {
      const body: UpdateResumeRequestBody = {
        resume: {
          title: data.title,
          jobType: resume.jobType,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          photoUrl: resume.photoUrl,
          summary: data.summary || null,
          skills: data.skills.map((skill) => skill.value),
          certificate: data.certificate.map((certificate) => certificate.value),
          visaInfo: data.visaInfo,
          availability: data.availability,
          educationSchool: data.educationSchool || null,
          educationMajor: data.educationMajor || null,
          educationYear: data.educationYear ? Number(data.educationYear) : null,
        },

        jobExperiences: data.jobExperiences.map((job) => ({
          companyName: job.companyName,
          position: job.position,
          jobType: job.jobType,
          description: job.description.map((description) => description.value),
          startDate: job.startDate,
          endDate: job.endDate || null,
        })),
      };

      const response = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "履歴書の更新に失敗しました");
      }

      router.push(`/resumes/${id}/preview`);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "履歴書の更新に失敗しました",
      );
    }
  };

  if (isLoading) {
    return (
      <p role="status" className="p-8 text-sm text-muted-foreground">
        履歴書を読み込み中…
      </p>
    );
  }

  if (error || !resumeResponse) {
    return (
      <div className="form-section">
        <p role="alert" className="text-danger">
          履歴書の取得に失敗しました。
        </p>
        <Link
          href="/resumes"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
        >
          履歴書一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form className="mx-auto max-w-5xl" onSubmit={handleSubmit(onSubmit)}>
        <Link
          href={`/resumes/${id}/preview`}
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded text-sm text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          プレビューへ戻る
        </Link>
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold tracking-widest text-primary">
            RESUME EDITOR
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            履歴書を編集
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            内容を整えて、あなたらしい履歴書に。保存するとプレビューで仕上がりを確認できます。
          </p>
        </header>
        <nav aria-label="編集する項目" className="mb-8 flex flex-wrap gap-2">
          {[
            ["personal", "基本情報"],
            ["summary-section", "自己PR"],
            ["experience", "職歴"],
            ["skills", "スキル"],
            ["certificate", "資格"],
            ["education", "学歴"],
          ].map(([anchor, label]) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium text-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <fieldset
          className="min-w-0 space-y-6"
          disabled={isSubmitting || isDeleting}
        >
          <section className="form-section">
            <label htmlFor="resume-title" className="form-label">
              タイトル
            </label>
            <input
              id="resume-title"
              {...register("title")}
              className="form-input"
              aria-invalid={!!errors.title}
              aria-describedby={
                errors.title
                  ? "resume-title-hint resume-title-error"
                  : "resume-title-hint"
              }
            />
            <p
              id="resume-title-hint"
              className="mt-2 text-sm text-muted-foreground"
            >
              自分用の管理名です。提出する履歴書には表示されません（50文字以内）。
            </p>
            <p id="resume-title-error" role="alert" className="text-danger">
              {errors.title?.message}
            </p>
          </section>
          <PersonalInformationFields />

          <SummaryFields />
          <section id="experience" className="form-section space-y-5">
            <div>
              <h2 className="form-heading">職歴</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                職歴は1〜3件登録してください（アルバイト経験も記入できます）。現在{" "}
                {jobExperienceFields.length} 件
              </p>
            </div>
            {jobExperienceFields.length > MAX_JOB_EXPERIENCES && (
              <p role="alert" className="text-danger">
                保存するには、残す職歴を選んで3件以内にしてください。
              </p>
            )}
            {(errors.jobExperiences?.root?.message ||
              errors.jobExperiences?.message) && (
              <p role="alert" className="text-danger">
                {errors.jobExperiences.root?.message ||
                  errors.jobExperiences.message}
              </p>
            )}
            {jobExperienceFields.map((field, index) => (
              <JobExperienceFields
                key={field.id}
                index={index}
                canRemove={jobExperienceFields.length > MIN_JOB_EXPERIENCES}
                onRemove={() => {
                  if (jobExperienceFields.length > MIN_JOB_EXPERIENCES)
                    removeJobExperience(index);
                }}
              />
            ))}

            <button
              type="button"
              disabled={jobExperienceFields.length >= MAX_JOB_EXPERIENCES}
              className={actionButtonVariants({
                variant: "secondary",
                className: "gap-2",
              })}
              onClick={() => {
                if (jobExperienceFields.length >= MAX_JOB_EXPERIENCES) return;
                appendJobExperience({
                  companyName: "",
                  position: "",
                  jobType: "",
                  startDate: "",
                  endDate: "",
                  description: [],
                });
              }}
            >
              <Plus size={16} aria-hidden="true" />
              職歴を追加
            </button>
          </section>
          <CertificateFields
            fields={certificateFields}
            append={appendCertificate}
            remove={removeCertificate}
          />

          <SkillsFields
            fields={skillFields}
            append={appendSkill}
            remove={removeSkill}
          />

          <EducationFields />

          <div
            className="sticky bottom-4 z-10 rounded-lg border border-border bg-background p-4 shadow-lg sm:p-5"
            aria-busy={isSubmitting}
          >
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mb-3 text-sm text-danger">
                入力内容を確認してください。エラーのある項目を修正して保存してください。
              </p>
            )}
            {saveError && (
              <p role="alert" className="text-danger">
                {saveError}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p role="status" className="text-xs text-muted-foreground">
                {isDirty
                  ? "未保存の変更があります"
                  : "編集した内容は保存すると反映されます"}
              </p>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting || !token}
                className={actionButtonVariants({ className: "gap-2" })}
              >
                <Save size={16} aria-hidden="true" />
                {isSubmitting ? "保存中…" : "保存してプレビュー"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div>
              <h2 className="text-sm font-medium">履歴書の削除</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                削除した履歴書は元に戻せません。
              </p>
            </div>
            {deleteError && (
              <p role="alert" className="mb-2 text-danger">
                {deleteError}
              </p>
            )}
            <button
              type="button"
              disabled={isSubmitting || isDeleting}
              className="form-remove border border-danger/30 px-4"
              onClick={async () => {
                if (isSubmitting || isDeleting) return;
                const isDeleted = await deleteResume(
                  id,
                  resumeResponse.resume.title,
                );
                if (isDeleted) {
                  setDeleted(true);
                  router.replace("/resumes");
                }
              }}
            >
              {isDeleting ? "削除中…" : "この履歴書を削除"}
            </button>
          </div>
        </fieldset>
      </form>
    </FormProvider>
  );
}
