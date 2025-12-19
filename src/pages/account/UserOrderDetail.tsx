import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getUserOrderById } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import UserOrderDetailSkeleton from '@/components/account/UserOrderDetailSkeleton';
import { AxiosError } from 'axios';

interface OrderListingInfo {
  listingId: string;
  title: string;
  price: number;
  quantity: number;
  author: string; // Added author property
}

interface Order {
  _id: string;
  createdAt: string;
  listingInfo: OrderListingInfo;
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  seller?: {
    fullName: string;
  };
  buyer?: {
    fullName: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const UserOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await getUserOrderById(id);
        setOrder(data);
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch order details";
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <UserOrderDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container-custom mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Order not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Order Details</h1>
        <p className="text-lg text-muted-foreground">Order ID: <span className="font-semibold">{order._id}</span></p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Order Date:</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status:</p>
            <Badge variant={getStatusVariant(order.status)} className="text-base">
              {order.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Price:</p>
            <p className="font-medium text-lg">${order.totalPrice.toFixed(2)}</p>
          </div>
          {order.buyer && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Buyer:</p>
              <p className="font-medium">{order.buyer.fullName}</p>
            </div>
          )}
          {order.seller && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Seller:</p>
              <p className="font-medium">{order.seller.fullName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="font-medium text-lg">
              {order.listingInfo.title} (x{order.listingInfo.quantity})
            </span>
            <span className="font-semibold text-lg">
              ${(order.listingInfo.price * order.listingInfo.quantity).toFixed(2)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">by {order.listingInfo.author || 'N/A'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrderDetail;
