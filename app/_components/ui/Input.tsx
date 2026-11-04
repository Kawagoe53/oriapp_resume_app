"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "./Label";

type Props = ComponentProps<"input"> & {
  errorMessage?: string;
  label?: string;
  registration?: UseFormRegisterReturn;
  hint?: string;
  variant?: "default" | "edit";
};

export default function Input({
  registration,
  errorMessage,
  label,
  hint,
  variant = "default",
  className,
  ...props
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const generatedId = useId();
  const id = props.id ?? registration?.name ?? generatedId;
  const descriptionId = errorMessage
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;
  const describedBy = [props["aria-describedby"], descriptionId]
    .filter(Boolean)
    .join(" ") || undefined;
  const isPassword = props.type === "password";

  return (
    <div className="min-w-0">
      {label && (variant === "edit" ? (
        <label htmlFor={id} className="form-label">{label}</label>
      ) : (
        <Label htmlFor={id}>{label}</Label>
      ))}
      <div className="relative">
        <input
          {...props}
          {...registration}
          id={id}
          aria-invalid={errorMessage ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          onChange={(event) => {
            registration?.onChange(event);
            props.onChange?.(event);
          }}
          onBlur={(event) => {
            registration?.onBlur(event);
            props.onBlur?.(event);
          }}
          type={isPassword && isPasswordVisible ? "text" : props.type}
          className={`${variant === "edit" ? "form-input" : "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"} ${isPassword ? "pr-12" : ""} ${className ?? ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={props.disabled}
            aria-label={`${label ?? "パスワード"}を${isPasswordVisible ? "非表示にする" : "表示する"}`}
            aria-controls={id}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPasswordVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
      {errorMessage && (
        <p id={`${id}-error`} role="alert" className={variant === "edit" ? "form-error" : "text-red-500"}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
