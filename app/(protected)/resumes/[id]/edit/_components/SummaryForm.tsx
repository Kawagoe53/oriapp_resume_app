"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  isSubmitting: boolean;
};

export default function SummaryForm({ register, isSubmitting }: Props) {
  return (
    <form>
      <label htmlFor="summary" className="block mb-2 font-medium">
        Summary
      </label>

      <textarea
        id="summary"
        {...register("summary")}
        rows={6}
        disabled={isSubmitting}
        className="w-full border rounded-md p-3"
        placeholder="Write your professional summary..."
      />
    </form>
  );
}
