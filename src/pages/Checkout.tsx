import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { placeOrder } from '@/lib/api';
import { clearCartAsync } from '@/store/cartSlice';
import { Address } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AxiosError } from 'axios';

// Define a simplified OrderData type for the frontend, matching what the backend expects
interface FrontendOrderData {
  shippingAddress: Address;
}

const shippingAddressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});


const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

      const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: {
          street: user?.address?.street || "",
          city: user?.address?.city || "",
          state: user?.address?.state || "",
          country: user?.address?.country || "",
        },
      });
  
    const handlePlaceOrder = async () => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to place an order.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
  
      if (items.length === 0) {
        toast({
          title: "Error",
          description: "Your cart is empty.",
          variant: "destructive",
        });
        navigate('/cart');
        return;
      }
  
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          title: "Error",
          description: "Please fill in all shipping address details.",
          variant: "destructive",
        });
        return;
      }
  
      setLoading(true);
      const shippingAddress: Address = form.getValues();
  
      try {
        const orderData: FrontendOrderData = {
          shippingAddress: shippingAddress,
        };
  
        await placeOrder(orderData);
  
        await dispatch(clearCartAsync());
        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully with Cash on Delivery.",
        });
        navigate('/'); // Redirect to home or an order confirmation page
      } catch (err: unknown) {
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        toast({
          title: "Error placing order",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom max-w-5xl">
          <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
  
          {items.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="pt-6">
                <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
                <Button onClick={() => navigate('/listings')} variant="hero">Browse Listings</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                    {items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center mb-2">
                        <span>{item.listing.title} (x{item.quantity})</span>
                        <span>${(item.listing.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                    </div>
                  </CardContent>
                </Card>
  
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">Shipping Address</h2>
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} disabled={loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Anytown" {...field} disabled={loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="CA" {...field} disabled={loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="USA" {...field} disabled={loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>
  
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" checked readOnly disabled={loading} />
                      <label htmlFor="cod" className="text-lg">Cash on Delivery</label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Pay with cash upon delivery of your order.</p>
                  </CardContent>
                </Card>
              </div>
  
              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">Order Total</h2>
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
                    <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Checkout;