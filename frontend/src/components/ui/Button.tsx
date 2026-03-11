type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: Props) {
  const base =
    "rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-black focus:ring-gray-900",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };

  const disabledStyle =
    "cursor-not-allowed opacity-60 hover:bg-current";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${
        disabled ? disabledStyle : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}
