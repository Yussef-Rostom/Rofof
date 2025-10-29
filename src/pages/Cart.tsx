import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/store/cartSlice";
import { RootState, AppDispatch } from "@/store";
import CartItemRow from "@/components/CartItemRow";
import CartSkeleton from "@/components/CartSkeleton";

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalAmount, status, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom max-w-5xl">
          <h1 className="font-display text-4xl font-bold mb-8">
            Shopping Cart
          </h1>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Start adding some listings to your cart!</p>
              <Link to="/listings">
                <Button variant="hero">Browse Listings</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItemRow key={item._id} item={item} />
              ))}
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between mb-6">
                    <span className="font-display text-lg font-semibold">Total</span>
                    <span className="font-display text-lg font-semibold text-primary">
                      ${totalAmount ? totalAmount.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <Link to="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
