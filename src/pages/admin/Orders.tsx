import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminMockOrders, AdminOrder } from "@/lib/adminMockData";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredOrders =
    statusFilter === "all"
      ? adminMockOrders
      : adminMockOrders.filter((order) => order.status === statusFilter);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "buyerName",
      label: "Buyer Name",
      sortable: true,
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
    },
    {
      key: "status",
      label: "Status",
      render: (order: AdminOrder) => {
        const variant =
          order.status === "Completed"
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
        <Link to={`/admin/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

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
