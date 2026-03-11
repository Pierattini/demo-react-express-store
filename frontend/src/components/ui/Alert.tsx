type AlertProps = {
  type: "success" | "error" | "info" | "warning";
  message: string;
};

export default function Alert({ type, message }: AlertProps) {
  const baseStyle =
    "px-4 py-3 rounded-md text-sm font-medium mb-4";

  const styles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className={`${baseStyle} ${styles[type]}`}>
      {message}
    </div>
  );
}
