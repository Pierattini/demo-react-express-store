import Skeleton from "../ui/Skeleton";

export default function CartSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_80px_80px] gap-3 items-center border p-3 rounded"
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}
