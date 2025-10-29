import { DataTableSkeleton } from "@/components/admin/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ListingsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-96" />
      </div>
      <DataTableSkeleton columns={6} />
    </div>
  );
};

export default ListingsPageSkeleton;
