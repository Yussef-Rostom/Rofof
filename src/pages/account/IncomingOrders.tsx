import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";
import { getMySales } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import IncomingOrdersPageSkeleton from '@/pages/account/IncomingOrdersPageSkeleton';

interface OrderItem {
  listingInfo: {
    title: string;
    author: string;
    price: number;
  };
  _id: string;
}

interface Order {
  _id: string;
  orderDate: string;
  items: OrderItem[];
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  buyer: {
    fullName: string;
  };
}

function IncomingOrders() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getMySales();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sales orders");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch sales orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [toast]);

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
    return <IncomingOrdersPageSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Incoming Orders</h2>
          <p className="text-muted-foreground">
            Manage orders from buyers who purchased your listings
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Incoming Orders</h2>
        <p className="text-muted-foreground">
          Manage orders from buyers who purchased your listings
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No incoming orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders as Seller</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Item(s)</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>{order.buyer.fullName}</TableCell>
                      <TableCell>{order.items?.length || 0} listing(s)</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/account/orders/${order._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { IncomingOrders as default };
