import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderData as AdminOrder } from "@/types"; // Using OrderData as AdminOrder
import { useToast } from "@/hooks/use-toast";
import { getAdminOrders } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAdminOrders();
        setOrders(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Fetch orders only once on component mount

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      render: (order: AdminOrder) => order._id,
    },
    {
      key: "listingTitle",
      label: "Listing Title",
      sortable: true,
      render: (order: AdminOrder) => order.listingInfo.title,
    },
    {
      key: "buyerName",
      label: "Buyer Name",
      sortable: true,
      render: (order: AdminOrder) => order.buyer.fullName,
    },
    {
      key: "totalPrice",
      label: "Total Price",
      sortable: true,
      render: (order: AdminOrder) => `$${order.totalPrice.toFixed(2)}`,
    },
    {
      key: "orderDate",
      label: "Order Date",
      sortable: true,
      render: (order: AdminOrder) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (order: AdminOrder) => {
        const variant =
          order.status === "Delivered"
            ? "default"
            : order.status === "Shipped"
            ? "secondary"
            : "outline";
        return <Badge variant={variant}>{order.status}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (order: AdminOrder) => (
        <Link to={`/admin/orders/${order._id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Order Management</h2>
        <p className="text-muted-foreground">Manage all orders on the platform</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable data={filteredOrders} columns={columns} />
    </div>
  );
}

