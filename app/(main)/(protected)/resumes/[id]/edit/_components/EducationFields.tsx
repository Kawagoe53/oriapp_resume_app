import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import EditField from "./EditField";
type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
};
export default function EducationFields({ register, errors }: Props) {
  return (
    <section id="education" className="form-section">
      <h2 className="form-heading">学歴</h2>
      <p className="form-description">
        学校名・専攻・卒業年を入力してください。
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <EditField
          label="学校名"
          registration={register("educationSchool")}
          error={errors.educationSchool?.message}
        />
        <EditField
          label="専攻"
          registration={register("educationMajor")}
          error={errors.educationMajor?.message}
        />
        <EditField
          label="卒業年"
          inputMode="numeric"
          placeholder="例：2024"
          registration={register("educationYear")}
          error={errors.educationYear?.message}
        />
      </div>
    </section>
  );
}
