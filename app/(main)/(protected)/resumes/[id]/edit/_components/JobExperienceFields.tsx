import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import EditField from "./EditField";
type Props = {
  index: number;
  register: UseFormRegister<ResumeEditFormData>;
  control: Control<ResumeEditFormData>;
  onRemove: () => void;
  canRemove: boolean;
  errors: FieldErrors<ResumeEditFormData>;
};
export default function JobExperienceFields({
  index,
  register,
  control,
  onRemove,
  canRemove,
  errors,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `jobExperiences.${index}.description`,
  });
  const jobErrors = errors.jobExperiences?.[index];
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">職歴 {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="form-remove gap-2"
          aria-label={`職歴 ${index + 1}を削除`}
        >
          <Trash2 size={16} aria-hidden="true" />
          削除
        </button>
      </div>
      <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
        {(
          [
            ["companyName", "会社名", "text"],
            ["position", "役職・ポジション", "text"],
            ["jobType", "業種・職種", "text"],
            ["startDate", "勤務開始日", "date"],
            ["endDate", "勤務終了日", "date"],
          ] as const
        ).map(([name, label, type]) => (
          <EditField
            key={name}
            label={label + (name !== "endDate" ? "（必須）" : "")}
            type={type}
            registration={register(`jobExperiences.${index}.${name}`)}
            error={jobErrors?.[name]?.message}
            hint={
              name === "endDate"
                ? "現在も勤務している場合は空欄にしてください。"
                : undefined
            }
          />
        ))}
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">仕事内容・実績</h4>
        <p className="text-xs leading-5 text-muted-foreground">
          担当した業務や成果を、1項目ずつ英語で入力してください。
        </p>
        <div
          className={`space-y-2 overscroll-contain p-1 ${fields.length > 4 ? "max-h-80 overflow-y-auto" : ""}`}
          role="region"
          aria-label={`職歴 ${index + 1}の仕事内容一覧`}
          tabIndex={fields.length > 4 ? 0 : undefined}
        >
          {fields.map((field, descriptionIndex) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`description-${index}-${descriptionIndex}`}
                  className="sr-only"
                >
                  職歴 {index + 1}の仕事内容 {descriptionIndex + 1}
                </label>
                <textarea
                  id={`description-${index}-${descriptionIndex}`}
                  {...register(
                    `jobExperiences.${index}.description.${descriptionIndex}.value`,
                  )}
                  rows={2}
                  className="form-input resize-y"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(descriptionIndex)}
                className="form-remove"
                aria-label={`職歴 ${index + 1}の仕事内容 ${descriptionIndex + 1}を削除`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="inline-flex min-h-11 items-center gap-2 rounded px-2 text-sm font-medium text-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus size={16} aria-hidden="true" />
          仕事内容を追加
        </button>
      </div>
    </div>
  );
}
