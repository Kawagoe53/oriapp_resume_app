"use client";

import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
};

export default function SummaryFields({ register }: Props) {
  return (
    <section>
      <label htmlFor="summary" className="block mb-2 font-medium">
        Summary
      </label>

      <textarea
        id="summary"
        {...register("summary")}
        rows={6}
        className="w-full border rounded-md p-3"
        placeholder="Write your professional summary..."
      />
    </section>
  );
}
