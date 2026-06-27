"use client";

import { ComponentProps } from "react";
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
  return (
    <div>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <input
        {...registration}
        {...props}
        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
