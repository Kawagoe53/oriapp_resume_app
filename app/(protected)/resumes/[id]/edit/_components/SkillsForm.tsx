"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import {
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

type SkillsFormProps = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
  fields: {
    id: string;
  }[];
  append: UseFieldArrayAppend<ResumeEditFormData, "skills">;
  remove: UseFieldArrayRemove;
  isSubmitting: boolean;
};

export default function SkillsForm({
  register,
  errors,
  fields,
  isSubmitting,
  append,
  remove,
}: SkillsFormProps) {
  return (
    <form>
      <h2>Skills</h2>

      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`skills.${index}.value`)}
              placeholder="Skill"
              disabled={isSubmitting}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              disabled={isSubmitting}
            >
              ×
            </button>

            {errors.skills?.[index]?.value && (
              <p>{errors.skills[index].value.message}</p>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={() => append({ value: "" })}>
        + Add Skill
      </button>
    </form>
  );
}
