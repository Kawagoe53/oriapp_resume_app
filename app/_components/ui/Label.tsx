"use client";

import { ComponentProps } from "react";
type Props = ComponentProps<"label"> & {
  label?: string;
};

export const Label = ({ children, ...props }: Props) => {
  return (
    <label
      {...props}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {children}
    </label>
  );
};
