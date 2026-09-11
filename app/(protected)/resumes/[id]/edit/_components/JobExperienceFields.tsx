"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  index: number;
  register: UseFormRegister<ResumeEditFormData>;
  control: Control<ResumeEditFormData>;
  onRemove: () => void;
};

export default function JobExperienceFields({
  index,
  register,
  control,

  onRemove,
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

        <button type="button" onClick={onRemove} className="text-red-500">
          Delete
        </button>
      </div>

      {/* Company */}
      <div>
        <label>Company Name</label>
        <input
          {...register(`jobExperiences.${index}.companyName`)}
          className="w-full rounded border p-2"
        />
      </div>

      {/* Position */}
      <div>
        <label>Position</label>
        <input
          {...register(`jobExperiences.${index}.position`)}
          className="w-full rounded border p-2"
        />
      </div>

      {/* Job Type */}
      <div>
        <label>Job Type</label>
        <input
          {...register(`jobExperiences.${index}.jobType`)}
          className="w-full rounded border p-2"
        />
      </div>

      {/* Start Date */}
      <div>
        <label>Start Date</label>
        <input
          {...register(`jobExperiences.${index}.startDate`)}
          className="w-full rounded border p-2"
        />
      </div>

      {/* End Date */}
      <div>
        <label>End Date</label>
        <input
          {...register(`jobExperiences.${index}.endDate`)}
          className="w-full rounded border p-2"
        />
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
