"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

type CertificateFormProps = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
  fields: FieldArrayWithId<ResumeEditFormData, "certificate", "id">[];
  append: UseFieldArrayAppend<ResumeEditFormData, "certificate">;
  remove: UseFieldArrayRemove;
  isSubmitting: boolean;
};

export default function CertificateForm({
  register,
  errors,
  fields,
  isSubmitting,
  append,
  remove,
}: CertificateFormProps) {
  return (
    <form>
      <h2>Certificate</h2>

      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`certificate.${index}.value`)}
            placeholder="Certificate"
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            disabled={isSubmitting}
          >
            Delete
          </button>

          {errors.certificate?.[index]?.value && (
            <p>{errors.certificate[index]?.value?.message}</p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ value: "" })}
        disabled={isSubmitting}
      >
        Add Certificate
      </button>
    </form>
  );
}
