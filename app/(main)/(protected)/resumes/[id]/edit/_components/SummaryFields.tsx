import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { useFormContext } from "react-hook-form";
export default function SummaryFields() {
  const { register } = useFormContext<ResumeEditFormData>();

  return (
    <section id="summary-section" className="form-section">
      <h2 className="form-heading">
        <label htmlFor="summary">自己PR</label>
      </h2>
      <p id="summary-hint" className="form-description">
        経験や強み、応募先で活かせることを英語でまとめましょう。
      </p>
      <textarea
        id="summary"
        {...register("summary")}
        rows={6}
        aria-describedby="summary-hint"
        className="form-input resize-y"
        placeholder="例：Friendly and reliable team member with experience in customer service…"
      />
    </section>
  );
}
