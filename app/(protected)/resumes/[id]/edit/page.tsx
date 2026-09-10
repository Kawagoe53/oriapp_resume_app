"use client";

import useFetch from "@/app/_hooks/useFetch";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  ResumeEditFormData,
  resumeEditSchema,
} from "@/app/_schemas/resumeEditSchema";
import { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { UpdateResumeRequestBody } from "@/app/_types/edit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CertificateForm from "./_components/CertificateForm";
import EducationForm from "./_components/EducationForm";
import JobExperienceForm from "./_components/JobExperienceForm";
import PersonalInformationForm from "./_components/PersonalInformationForm";
import SkillsForm from "./_components/SkillsForm";
import SummaryForm from "./_components/SummaryForm";

export default function EditPage() {
  const router = useRouter();
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
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
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

      jobExperiences: resume.jobExperiences.map((experience) => ({
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
      console.error(error);
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
      <h1>履歴書編集</h1>
      <PersonalInformationForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <CertificateForm
        register={register}
        errors={errors}
        fields={certificateFields}
        append={appendCertificate}
        remove={removeCertificate}
        isSubmitting={isSubmitting}
      />

      <SkillsForm
        register={register}
        errors={errors}
        fields={skillFields}
        append={appendSkill}
        remove={removeSkill}
        isSubmitting={isSubmitting}
      />

      <SummaryForm register={register} isSubmitting={isSubmitting} />

      {jobExperienceFields.map((field, index) => (
        <JobExperienceForm
          key={field.id}
          index={index}
          register={register}
          control={control}
          isSubmitting={isSubmitting}
          onRemove={() => removeJobExperience(index)}
        />
      ))}

      <button
        type="button"
        onClick={() =>
          appendJobExperience({
            companyName: "",
            position: "",
            jobType: "",
            startDate: "",
            endDate: "",
            description: [],
          })
        }
      >
        + Add Job Experience
      </button>

      <EducationForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
