import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2 } from "lucide-react";

export default function Cart() {
  // Mock empty cart for now
  const cartItems: any[] = [];
  const subtotal = 0;

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Start adding some books to your cart!</p>
              <Link to="/books">
                <Button variant="hero">Browse Books</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Cart items will be mapped here */}
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
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
                      ${subtotal.toFixed(2)}
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
