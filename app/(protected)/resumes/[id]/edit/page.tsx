"use client";

import useFetch from "@/app/_hooks/useFetch";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  MAX_JOB_EXPERIENCES,
  MIN_JOB_EXPERIENCES,
  ResumeEditFormData,
  resumeEditSchema,
} from "@/app/_schemas/resumeEditSchema";
import { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { UpdateResumeRequestBody } from "@/app/_types/edit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import CertificateFields from "./_components/CertificateFields";
import EducationFields from "./_components/EducationFields";
import JobExperienceFields from "./_components/JobExperienceFields";
import PersonalInformationFields from "./_components/PersonalInformationFields";
import SkillsFields from "./_components/SkillsFields";
import SummaryFields from "./_components/SummaryFields";

export default function EditPage() {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const { id } = useParams();
  const { token } = useSupabaseSession();

  const {
    data: resumeResponse,
    error,
    isLoading,
  } = useFetch<ResumeShowResponse>(`/api/resumes/${id}`);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResumeEditFormData>({
    resolver: zodResolver(resumeEditSchema),
  });

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

  useEffect(() => {
    if (!resumeResponse) return;

    const resume = resumeResponse.resume;

    reset({
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

      jobExperiences: resume.jobExperiences.length === 0 ? [{
        companyName: "", position: "", jobType: "", startDate: "", endDate: "", description: [],
      }] : resume.jobExperiences.map((experience) => ({
        companyName: experience.companyName,
        position: experience.position,
        jobType: experience.jobType,
        startDate: new Date(experience.startDate).toISOString().split("T")[0],
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
    if (!token) {
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
          title: resume.title ?? "",
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
      setSaveError(error instanceof Error ? error.message : "履歴書の更新に失敗しました");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !resumeResponse) {
    return <div>履歴書の取得に失敗しました</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting}>
        <h1>履歴書編集</h1>
        <PersonalInformationFields register={register} errors={errors} />

        <CertificateFields
          register={register}
          errors={errors}
          fields={certificateFields}
          append={appendCertificate}
          remove={removeCertificate}
        />

        <SkillsFields
          register={register}
          errors={errors}
          fields={skillFields}
          append={appendSkill}
          remove={removeSkill}
        />

        <SummaryFields register={register} />

        <p className="my-4 text-sm">
          職歴は1〜3件登録してください（アルバイト経験も記入できます）。現在 {jobExperienceFields.length} 件
        </p>
        {jobExperienceFields.length > MAX_JOB_EXPERIENCES && (
          <p role="alert" className="text-red-600">保存するには、残す職歴を選んで3件以内にしてください。</p>
        )}
        {(errors.jobExperiences?.root?.message || errors.jobExperiences?.message) && (
          <p role="alert" className="text-red-600">{errors.jobExperiences.root?.message || errors.jobExperiences.message}</p>
        )}
        {jobExperienceFields.map((field, index) => (
          <JobExperienceFields
            key={field.id}
            index={index}
            register={register}
            control={control}
            errors={errors}
            canRemove={jobExperienceFields.length > MIN_JOB_EXPERIENCES}
            onRemove={() => {
              if (jobExperienceFields.length > MIN_JOB_EXPERIENCES) removeJobExperience(index);
            }}
          />
        ))}

        <button
          type="button"
          disabled={jobExperienceFields.length >= MAX_JOB_EXPERIENCES}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
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
          + Add Job Experience
        </button>

        <EducationFields register={register} errors={errors} />

        {saveError && <p role="alert" className="text-red-600">{saveError}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </fieldset>
    </form>
  );
}
