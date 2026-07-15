"use client";
import { ComponentProps } from "react";

type Props = ComponentProps<"button">;

export default function Button({ children, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      {...props}
      className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {children}
    </button>
  );
}
