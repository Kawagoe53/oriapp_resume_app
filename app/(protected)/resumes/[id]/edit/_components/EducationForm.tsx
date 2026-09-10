"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
  isSubmitting: boolean;
};

export default function EducationForm({
  register,
  errors,
  isSubmitting,
}: Props) {
  return (
    <form>
      <h2>Education</h2>

      <div>
        <label htmlFor="educationSchool">School</label>
        <input
          id="educationSchool"
          {...register("educationSchool")}
          disabled={isSubmitting}
        />
        {errors.educationSchool && <p>{errors.educationSchool.message}</p>}
      </div>

      <div>
        <label htmlFor="educationMajor">Major</label>
        <input
          id="educationMajor"
          {...register("educationMajor")}
          disabled={isSubmitting}
        />
        {errors.educationMajor && <p>{errors.educationMajor.message}</p>}
      </div>

      <div>
        <label htmlFor="educationYear">Year</label>
        <input
          id="educationYear"
          {...register("educationYear")}
          disabled={isSubmitting}
        />
        {errors.educationYear && <p>{errors.educationYear.message}</p>}
      </div>
    </form>
  );
}
