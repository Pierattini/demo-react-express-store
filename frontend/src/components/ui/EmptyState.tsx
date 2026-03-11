import type { ReactNode } from "react";
import Card from "./Card";
import Button from "./Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="p-10 text-center space-y-4 border border-gray-100 shadow-sm">
      
      {icon && (
        <div className="flex justify-center text-4xl">
          {icon}
        </div>
      )}

      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-gray-500">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}
