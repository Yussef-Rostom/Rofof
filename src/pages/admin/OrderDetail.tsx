import { useParams, Link } from "react-router-dom";
import { getOrderById, adminMockUsers, adminMockListings } from "@/lib/adminMockData";
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
import { ArrowLeft, XCircle, Truck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const order = getOrderById(id || "");

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

  // Find buyer and mock seller
  const buyer = adminMockUsers.find((user) => user.name === order.buyerName);
  const mockSeller = adminMockUsers[0]; // Mock seller for demo

  // Mock order items
  const orderItems = [
    {
      id: "1",
      title: "The Great Gatsby",
      price: 12.99,
      quantity: 1,
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      price: 15.50,
      quantity: 2,
    },
  ];

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
              <CardTitle>Order #{order.id}</CardTitle>
              <Badge
                variant={
                  order.status === "Completed"
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
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
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
                    <Link to={`/admin/users/${buyer.id}`}>
                      <Button variant="link" className="p-0 h-auto">
                        {order.buyerName}
                      </Button>
                    </Link>
                  ) : (
                    <p>{order.buyerName}</p>
                  )}
                  {buyer && <p className="text-sm text-muted-foreground">{buyer.email}</p>}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Seller Information</p>
                <div className="space-y-1">
                  <Link to={`/admin/users/${mockSeller.id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      {mockSeller.name}
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground">{mockSeller.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium mb-2">Shipping Address</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>123 Main Street</p>
                <p>Apartment 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
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
                    <TableHead>Book Title</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
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
                onClick={() => {
                  toast({
                    title: "Order Cancelled",
                    description: `Order ${order.id} has been cancelled`,
                    variant: "destructive",
                  });
                }}
                disabled={order.status === "Completed"}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Order Shipped",
                    description: `Order ${order.id} has been marked as shipped`,
                  });
                }}
                disabled={order.status === "Shipped" || order.status === "Completed"}
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Order Completed",
                    description: `Order ${order.id} has been marked as completed`,
                  });
                }}
                disabled={order.status === "Completed"}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
