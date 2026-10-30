"use client";

import {
  contactSchema,
  contactTypeLabels,
  type ContactValues,
} from "@/app/_schemas/contactSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const fields = [
  {
    key: "name",
    label: "名前",
    type: "text",
    autoComplete: "name",
  },
  {
    key: "email",
    label: "メールアドレス",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "subject",
    label: "題名",
    type: "text",
    autoComplete: "off",
  },
  {
    key: "content",
    label: "内容",
    type: "text",
    autoComplete: "off",
  },
] as const; //keyの型がstring 型として推論されないためにas constをつける。
//これにより、keyの型が"content" | "email" | "name" | "subject"となる。

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "GENERAL",
      name: "",
      email: "",
      subject: "",
      content: "",
    },
  });

  async function onSubmit(values: ContactValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        setError("root", {
          message:
            result.message || "送信できませんでした。もう一度お試しください。",
        });
        return;
      }
      reset();
      setSubmitted(true);
    } catch {
      setError("root", {
        message: "通信に失敗しました。接続を確認して、もう一度お試しください。",
      });
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3rem)] min-h-[640px] w-full max-w-2xl flex-col lg:h-[calc(100dvh-4rem)]">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">お問い合わせ</h1>
        <p className="rk-muted mt-2 text-sm leading-6">
          使い方のご質問、不具合のご報告、ご要望などをお送りください。ログインせずにご利用いただけます。
        </p>
      </header>
      {submitted ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div role="status" aria-live="polite">
            <h2 className="text-lg font-semibold">
              お問い合わせを受け付けました
            </h2>
            <p className="rk-muted mt-3 text-sm leading-7">
              内容を確認のうえ、必要に応じて入力いただいたメールアドレスへご連絡します。
            </p>
          </div>
          <button
            type="button"
            className="rk-button rk-button--secondary mt-6"
            onClick={() => setSubmitted(false)}
          >
            別のお問い合わせを送る
          </button>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-1 flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6"
        >
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-1 flex-col gap-4"
          >
            <legend className="sr-only">お問い合わせ内容</legend>
            <div className="min-w-0 shrink-0">
              <label htmlFor="contact-type" className="text-sm font-medium">
                お問い合わせの種類
                <span className="rk-muted ml-2 text-xs">必須</span>
              </label>
              <select
                id="contact-type"
                {...register("type")}
                required
                aria-invalid={Boolean(errors.type)}
                aria-describedby={
                  errors.type ? "contact-type-error" : undefined
                }
                className="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base outline-none focus-visible:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-200 disabled:opacity-60"
              >
                {Object.entries(contactTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p id="contact-type-error" className="rk-error mt-2">
                  {errors.type.message}
                </p>
              )}
            </div>
            {fields.map(({ key, label, type, autoComplete }) => {
              const props = {
                id: key,
                ...register(key),
                required: true,
                "aria-invalid": Boolean(errors[key]),
                "aria-describedby": errors[key] ? `${key}-error` : undefined,
                className:
                  "mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base outline-none focus-visible:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-200 disabled:opacity-60",
              };
              return (
                <div
                  key={key}
                  className={
                    key === "content"
                      ? "flex min-w-0 flex-1 flex-col"
                      : "min-w-0 shrink-0"
                  }
                >
                  <label htmlFor={key} className="text-sm font-medium">
                    {label}
                    <span className="rk-muted ml-2 text-xs">必須</span>
                  </label>
                  {key === "content" ? (
                    <textarea
                      {...props}
                      rows={4}
                      className={`${props.className} min-h-24 flex-1 resize-y`}
                      placeholder="お問い合わせ内容を入力してください"
                    />
                  ) : (
                    <input {...props} type={type} autoComplete={autoComplete} />
                  )}
                  {errors[key] && (
                    <p id={`${key}-error`} className="rk-error mt-2">
                      {errors[key]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </fieldset>
          {errors.root && (
            <p role="alert" className="rk-error">
              {errors.root.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rk-button rk-button--primary w-full shrink-0 sm:w-auto sm:self-start"
          >
            {isSubmitting ? "送信中…" : "送信する"}
          </button>
        </form>
      )}
    </div>
  );
}
