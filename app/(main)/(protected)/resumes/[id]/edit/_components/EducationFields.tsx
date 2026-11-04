import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { useFormContext } from "react-hook-form";
import Input from "@/app/_components/ui/Input";
export default function EducationFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeEditFormData>();

  return (
    <section id="education" className="form-section">
      <h2 className="form-heading">学歴</h2>
      <p className="form-description">
        学校名・専攻・卒業年を入力してください。
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          variant="edit"
          label="学校名"
          registration={register("educationSchool")}
          errorMessage={errors.educationSchool?.message}
        />
        <Input
          variant="edit"
          label="専攻"
          registration={register("educationMajor")}
          errorMessage={errors.educationMajor?.message}
        />
        <Input
          variant="edit"
          label="卒業年"
          inputMode="numeric"
          placeholder="例：2024"
          registration={register("educationYear")}
          errorMessage={errors.educationYear?.message}
        />
      </div>
    </section>
  );
}
