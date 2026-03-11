import Skeleton from "../ui/Skeleton";

export default function ProductSkeleton() {
  return (
    <div className="border rounded-xl p-3 grid gap-2">
      <Skeleton className="h-[180px] rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-full mt-2" />
    </div>
  );
}
