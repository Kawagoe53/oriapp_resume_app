import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { actionButtonVariants } from "@/app/_components/ui/actionButtonVariants";
import EditField from "./EditField";
type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
  fields: FieldArrayWithId<ResumeEditFormData, "skills", "id">[];
  append: UseFieldArrayAppend<ResumeEditFormData, "skills">;
  remove: UseFieldArrayRemove;
};
export default function SkillsFields({
  register,
  errors,
  fields,
  append,
  remove,
}: Props) {
  return (
    <section id="skills" className="form-section">
      <h2 className="form-heading">スキル</h2>
      <p className="form-description">
        応募先に伝えたいスキルを英語で入力してください。
      </p>
      <div className="space-y-4">
        {fields.length === 0 && (
          <p className="rounded-md bg-surface p-4 text-sm text-muted-foreground">
            スキルはまだ登録されていません。必要に応じて追加できます。
          </p>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <EditField
                label={`スキル ${index + 1}`}
                registration={register(`skills.${index}.value`)}
                placeholder="例：Customer service"
                error={errors.skills?.[index]?.value?.message}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="form-remove mt-7"
              aria-label={`スキル ${index + 1}を削除`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ value: "" })}
        className={actionButtonVariants({
          variant: "secondary",
          className: "mt-5 gap-2",
        })}
      >
        <Plus size={16} aria-hidden="true" />
        スキルを追加
      </button>
    </section>
  );
}
