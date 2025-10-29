import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CartItemSkeleton = () => {
  return (
    <Card className="flex items-center p-4">
      <Skeleton className="w-20 h-24 rounded-md mr-4" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-1/5" />
      </div>
      <Skeleton className="h-10 w-10" />
    </Card>
  );
};

export default CartItemSkeleton;
