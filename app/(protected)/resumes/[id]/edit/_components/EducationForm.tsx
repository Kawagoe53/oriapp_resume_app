"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
};

export default function EducationForm({ register, errors }: Props) {
  return (
    <section>
      <h2>Education</h2>

      <div>
        <label htmlFor="educationSchool">School</label>
        <input id="educationSchool" {...register("educationSchool")} />
        {errors.educationSchool && <p>{errors.educationSchool.message}</p>}
      </div>

      <div>
        <label htmlFor="educationMajor">Major</label>
        <input id="educationMajor" {...register("educationMajor")} />
        {errors.educationMajor && <p>{errors.educationMajor.message}</p>}
      </div>

      <div>
        <label htmlFor="educationYear">Year</label>
        <input id="educationYear" {...register("educationYear")} />
        {errors.educationYear && <p>{errors.educationYear.message}</p>}
      </div>
    </section>
  );
}
