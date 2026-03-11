import Skeleton from "../ui/Skeleton";

export default function OrdersSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border rounded p-3 grid gap-2"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  );
}
