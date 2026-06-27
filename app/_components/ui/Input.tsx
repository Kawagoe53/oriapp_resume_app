"use client";

import { ComponentProps } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

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
  return (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input {...registration} {...props} />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
