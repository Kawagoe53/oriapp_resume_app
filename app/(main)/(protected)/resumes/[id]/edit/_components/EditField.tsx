import type { ComponentProps } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = ComponentProps<"input"> & {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
};

export default function EditField({
  label,
  registration,
  error,
  hint,
  ...props
}: Props) {
  const id = props.id ?? registration.name;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        {...props}
        {...registration}
        id={id}
        className="form-input"
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className="mt-2 text-xs leading-5 text-muted-foreground"
        >
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
