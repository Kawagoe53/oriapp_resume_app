"use client";

import { InputHTMLAttributes } from "react";

type Props = {
  id: string;
  disabled?: boolean;
  label: string;
  type: string;
  registration: InputHTMLAttributes<HTMLInputElement>;
  errorMessage?: string; //エラーでない場合もあるからオプショナル
  placeholder: string;
};

export default function Input({
  disabled,
  id,
  label,
  type,
  registration,
  errorMessage,
  placeholder,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id} //ラベルとinputの紐付け
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        id={id} //ラベルとinputの紐付け
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        placeholder={placeholder}
        disabled={disabled} //送信中に入力できないようにしている
        {...registration}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
