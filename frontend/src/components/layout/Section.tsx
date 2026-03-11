import clsx from "clsx";
import type { ReactNode } from "react";
import Container from "./Container";

type SectionSize = "sm" | "md" | "lg" | "xl" | "full";
type SectionSpacing = "sm" | "md" | "lg" | "xl";

type SectionProps = {
  children: ReactNode;
  size?: SectionSize;
  spacing?: SectionSpacing;
  className?: string;
};

const sizeMap: Record<SectionSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-none",
};

const spacingMap: Record<SectionSpacing, string> = {
  sm: "py-10",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
};

export default function Section({
  children,
  size = "md",
  spacing = "md",
  className,
}: SectionProps) {
  return (
    <Container className={clsx(spacingMap[spacing])}>
      <div
        className={clsx(
          "mx-auto space-y-6",
          sizeMap[size],
          className
        )}
      >
        {children}
      </div>
    </Container>
  );
}
