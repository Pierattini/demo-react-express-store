import { forwardRef } from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-gray-400",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
