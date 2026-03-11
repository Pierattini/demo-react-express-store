import { useId } from "react";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {/* Input wrapper */}
      <div>
        {children}
      </div>

      {/* Hint */}
      {!error && hint && (
        <p className="text-xs text-gray-500">
          {hint}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs font-medium text-red-600 animate-fade-up">
          {error}
        </p>
      )}
    </div>
  );
}
