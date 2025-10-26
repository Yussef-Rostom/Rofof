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

// Mock data for purchase history (as a buyer)
const mockPurchaseHistory = [
  {
    id: "ORD-201",
    orderDate: "2024-04-22",
    items: 2,
    totalPrice: 28.49,
    status: "Pending" as const,
    seller: "Jane Cooper",
  },
  {
    id: "ORD-202",
    orderDate: "2024-04-19",
    items: 1,
    totalPrice: 15.99,
    status: "Shipped" as const,
    seller: "Michael Brown",
  },
  {
    id: "ORD-203",
    orderDate: "2024-04-15",
    items: 3,
    totalPrice: 42.97,
    status: "Delivered" as const,
    seller: "Sarah Johnson",
  },
  {
    id: "ORD-204",
    orderDate: "2024-04-10",
    items: 1,
    totalPrice: 12.99,
    status: "Delivered" as const,
    seller: "David Kim",
  },
];

export default function PurchaseHistory() {
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Purchase History</h2>
        <p className="text-muted-foreground">View all books you've purchased</p>
      </div>

      {mockPurchaseHistory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You haven't made any purchases yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders as Buyer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.items} book(s)</TableCell>
                      <TableCell>{order.seller}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "View Details",
                              description: `Viewing details for order ${order.id}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
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
