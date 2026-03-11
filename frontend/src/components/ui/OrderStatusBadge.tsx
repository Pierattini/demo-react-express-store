type Props = {
  status: string;
};

export default function OrderStatusBadge({ status }: Props) {
  const map: Record<
    string,
    { label: string; bg: string; color: string; icon: string }
  > = {
    pending: {
      label: "Pendiente",
      bg: "#fff3cd",
      color: "#856404",
      icon: "⏳",
    },
    paid: {
      label: "Pagado",
      bg: "#d4edda",
      color: "#155724",
      icon: "✅",
    },
    cancelled: {
      label: "Cancelado",
      bg: "#f8d7da",
      color: "#721c24",
      icon: "❌",
    },
  };

  const badge = map[status] ?? {
    label: status,
    bg: "#eee",
    color: "#333",
    icon: "ℹ️",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: badge.bg,
        color: badge.color,
      }}
    >
      <span>{badge.icon}</span>
      {badge.label}
    </span>
  );
}
