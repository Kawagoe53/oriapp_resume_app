import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/app/_components/ui/Input";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
};
const fields = [
  ["fullName", "氏名", "text", "name"],
  ["email", "メールアドレス", "email", "email"],
  ["phone", "電話番号", "tel", "tel"],
  ["address", "住所", "text", "street-address"],
  ["visaInfo", "ビザ情報", "text", "off"],
  ["availability", "勤務開始可能日・勤務可能時間", "text", "off"],
] as const;
export default function PersonalInformationFields({ register, errors }: Props) {
  return (
    <section id="personal" className="form-section">
      <h2 className="form-heading">基本情報</h2>
      <p className="form-description">
        連絡先や勤務条件を確認しましょう。履歴書に載せる内容は英語で入力してください。
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(([name, label, type, autoComplete]) => (
          <Input
            variant="edit"
            key={name}
            label={label}
            type={type}
            autoComplete={autoComplete}
            registration={register(name)}
            errorMessage={errors[name]?.message}
          />
        ))}
      </div>
    </section>
  );
}
