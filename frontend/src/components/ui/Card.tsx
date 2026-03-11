type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
      className={`
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm
        ${hover ? "transition hover:shadow-md" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
