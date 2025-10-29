import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getOrderById, updateOrderStatus } from "@/lib/api";
import { OrderData as AdminOrder, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, XCircle, Truck, CheckCircle2, Hourglass, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Another dummy comment to force re-transpilation
export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(id);
      setOrder(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async (newStatus: AdminOrder["status"]) => {
    if (!order || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast({
        title: "Order Status Updated",
        description: `Order ${order._id} status changed to ${newStatus}`,
      });
      fetchOrder(); // Re-fetch order to update UI
    } catch (err: any) {
      toast({
        title: "Failed to Update Status",
        description: err.message || "An error occurred while updating order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[30px] w-[200px]" />
        <Skeleton className="h-[20px] w-[300px]" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-[40px] w-[150px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  const buyer: User = order.buyer;
  const seller: User = order.seller;

  const isStatus = (status: AdminOrder["status"]) => order.status === status;
  const isPastStatus = (status: AdminOrder["status"]) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    return statuses.indexOf(order.status) > statuses.indexOf(status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{order._id}</CardTitle>
              <Badge
                variant={
                  order.status === "Delivered"
                    ? "default"
                    : order.status === "Shipped"
                    ? "secondary"
                    : "outline"
                }
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="font-medium text-green-600">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer & Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium mb-2">Buyer Information</p>
                <div className="space-y-1">
                  {buyer ? (
                    <Link to={`/admin/users/${buyer._id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        {buyer.fullName}
                      </Button>
                    </Link>
                  ) : (
                    <p>N/A</p>
                  )}
                  {buyer && <p className="text-sm text-muted-foreground">{buyer.email}</p>}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Seller Information</p>
                <div className="space-y-1">
                  {seller ? (
                    <Link to={`/admin/users/${seller._id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        {seller.fullName}
                      </Button>
                    </Link>
                  ) : (
                    <p>N/A</p>
                  )}
                  {seller && <p className="text-sm text-muted-foreground">{seller.email}</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium mb-2">Shipping Address</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items in Order */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing Title</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={order.listingInfo.listingId}>
                    <TableCell className="font-medium">{order.listingInfo.title}</TableCell>
                    <TableCell className="text-right">${order.listingInfo.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{order.listingInfo.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${(order.listingInfo.price * order.listingInfo.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("Pending")}
                disabled={isUpdatingStatus || isStatus("Pending")}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Mark as Pending
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("Processing")}
                disabled={isUpdatingStatus || isStatus("Processing")}
              >
                <Hourglass className="h-4 w-4 mr-2" />
                Mark as Processing
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("Shipped")}
                disabled={isUpdatingStatus || isStatus("Shipped")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("Delivered")}
                disabled={isUpdatingStatus || isStatus("Delivered")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("Cancelled")}
                disabled={isUpdatingStatus || isStatus("Cancelled")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
