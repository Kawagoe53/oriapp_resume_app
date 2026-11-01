"use client";

import { Eye, EyeOff } from "lucide-react";
import { ComponentProps, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "./Label";

type Props = ComponentProps<"input"> & {
  errorMessage?: string;
  label?: string;
  registration?: UseFormRegisterReturn;
};

export default function Input({
  registration,
  errorMessage,
  label,
  ...props
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = props.type === "password";

  return (
    <div>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <div className="relative">
        <input
          {...registration}
          {...props}
          type={isPassword && isPasswordVisible ? "text" : props.type}
          className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={props.disabled}
            aria-label={`${label ?? "パスワード"}を${isPasswordVisible ? "非表示にする" : "表示する"}`}
            aria-controls={props.id}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPasswordVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        )}
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
