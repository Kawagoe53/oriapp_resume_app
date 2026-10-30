import { z } from "zod";

export const contactTypeLabels = {
  GENERAL: "一般的なお問い合わせ",
  SUPPORT: "使い方・不具合の相談",
  FEEDBACK: "要望・フィードバック",
  OTHER: "その他",
} as const;

export const contactSchema = z.object({
  type: z.enum(["GENERAL", "SUPPORT", "FEEDBACK", "OTHER"], {
    error: "お問い合わせの種類を選択してください",
  }),
  name: z.string().trim().min(1, "名前を入力してください").max(50, "名前は50文字以内で入力してください"),
  email: z.string().trim().toLowerCase().pipe(z.email("有効なメールアドレスを入力してください").max(254)),
  subject: z.string().trim().min(1, "題名を入力してください").max(100, "題名は100文字以内で入力してください").regex(/^[^\r\n]*$/, "題名に改行は使用できません"),
  content: z.string().trim().min(1, "内容を入力してください").max(5000, "内容は5,000文字以内で入力してください"),
});

export type ContactValues = z.infer<typeof contactSchema>;
