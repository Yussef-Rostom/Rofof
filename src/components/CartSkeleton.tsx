import CartItemSkeleton from "@/components/CartItemSkeleton";

const CartSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>
    </div>
  );
};

export default CartSkeleton;