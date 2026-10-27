"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  index: number;
  register: UseFormRegister<ResumeEditFormData>;
  control: Control<ResumeEditFormData>;
  onRemove: () => void;
  canRemove: boolean;
  errors: FieldErrors<ResumeEditFormData>;
};

export default function JobExperienceFields({
  index,
  register,
  control,

  onRemove,
  canRemove,
  errors,
}: Props) {
  const {
    fields: descriptionFields,
    append: appendDescription,
    remove: removeDescription,
  } = useFieldArray({
    control,
    name: `jobExperiences.${index}.description`,
  });

  return (
    <section className="space-y-4 rounded-lg border p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Job Experience {index + 1}</h3>

        <button type="button" onClick={onRemove} disabled={!canRemove} className="text-red-500 disabled:opacity-40 disabled:cursor-not-allowed">
          Delete
        </button>
      </div>

      {/* Company */}
      <div>
        <label>Company Name</label>
        <input
          {...register(`jobExperiences.${index}.companyName`)}
          aria-invalid={!!errors.jobExperiences?.[index]?.companyName}
          className="w-full rounded border p-2"
        />
        {errors.jobExperiences?.[index]?.companyName && (
          <p role="alert" className="text-sm text-red-600">{errors.jobExperiences[index]?.companyName?.message}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label>Position</label>
        <input
          {...register(`jobExperiences.${index}.position`)}
          aria-invalid={!!errors.jobExperiences?.[index]?.position}
          className="w-full rounded border p-2"
        />
        {errors.jobExperiences?.[index]?.position && (
          <p role="alert" className="text-sm text-red-600">{errors.jobExperiences[index]?.position?.message}</p>
        )}
      </div>

      {/* Job Type */}
      <div>
        <label>Job Type</label>
        <input
          {...register(`jobExperiences.${index}.jobType`)}
          aria-invalid={!!errors.jobExperiences?.[index]?.jobType}
          className="w-full rounded border p-2"
        />
        {errors.jobExperiences?.[index]?.jobType && (
          <p role="alert" className="text-sm text-red-600">{errors.jobExperiences[index]?.jobType?.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label>Start Date</label>
        <input
          {...register(`jobExperiences.${index}.startDate`)}
          aria-invalid={!!errors.jobExperiences?.[index]?.startDate}
          className="w-full rounded border p-2"
        />
        {errors.jobExperiences?.[index]?.startDate && (
          <p role="alert" className="text-sm text-red-600">{errors.jobExperiences[index]?.startDate?.message}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label>End Date</label>
        <input
          {...register(`jobExperiences.${index}.endDate`)}
          aria-invalid={!!errors.jobExperiences?.[index]?.endDate}
          className="w-full rounded border p-2"
        />
        {errors.jobExperiences?.[index]?.endDate && (
          <p role="alert" className="text-sm text-red-600">{errors.jobExperiences[index]?.endDate?.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label>Job Description</label>

        {descriptionFields.map((field, descriptionIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <span>•</span>

            <input
              {...register(
                `jobExperiences.${index}.description.${descriptionIndex}.value`,
              )}
              className="flex-1 rounded border p-2"
            />

            <button
              type="button"
              onClick={() => removeDescription(descriptionIndex)}
              className="text-red-500"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendDescription({ value: "" })}
          className="text-sm text-blue-500"
        >
          + Add Description
        </button>
      </div>
    </section>
  );
}
