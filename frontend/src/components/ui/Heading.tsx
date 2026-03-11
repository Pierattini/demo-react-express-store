import type { ReactNode } from "react";
import clsx from "clsx";

type HeadingProps = {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
};

export default function Heading({
  children,
  level = 1,
  className,
}: HeadingProps) {
  const baseStyles = "font-semibold tracking-tight text-gray-900";

  const sizeStyles = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
  };

  if (level === 1) {
    return (
      <h1 className={clsx(baseStyles, sizeStyles[1], className)}>
        {children}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 className={clsx(baseStyles, sizeStyles[2], className)}>
        {children}
      </h2>
    );
  }

  return (
    <h3 className={clsx(baseStyles, sizeStyles[3], className)}>
      {children}
    </h3>
  );
}
