import * as z from "zod";

// バリデーションスキーマの定義
export const signUpSchema = z
  .object({
    email: z.email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" })
      .regex(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/, {
        message:
          "半角英大文字、英小文字、数字をそれぞれ1文字以上含めてください",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください" })
      .regex(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/, {
        message:
          "半角英大文字、英小文字、数字をそれぞれ1文字以上含めてください",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
    // エラーをconfirmPasswordフィールドに表示
    //複数フィールドをまたいだ検証をするときに使う
  });

export const loginSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" })
    .regex(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/, {
      message: "半角英大文字、英小文字、数字をそれぞれ1文字以上含めてください",
    }),
});

// 型定義のエクスポート
export type SignUpSchemaValues = z.infer<typeof signUpSchema>;
export type LogInSchemaValues = z.infer<typeof loginSchema>;

// 再設定も新規登録と同じパスワード条件・確認欄を使う。
export const resetPasswordSchema = z.object({
  password: signUpSchema.shape.password,
  confirmPassword: signUpSchema.shape.confirmPassword,
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = loginSchema.pick({ email: true });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
