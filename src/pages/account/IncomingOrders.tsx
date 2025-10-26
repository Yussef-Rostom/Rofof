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

// Mock data for incoming orders (as a seller)
const mockIncomingOrders = [
  {
    id: "ORD-101",
    buyerName: "Alice Williams",
    items: "The Great Gatsby",
    totalPrice: 12.99,
    orderDate: "2024-04-20",
    status: "Pending" as const,
  },
  {
    id: "ORD-102",
    buyerName: "Bob Smith",
    items: "1984",
    totalPrice: 13.99,
    orderDate: "2024-04-18",
    status: "Shipped" as const,
  },
  {
    id: "ORD-103",
    buyerName: "Carol Johnson",
    items: "To Kill a Mockingbird",
    totalPrice: 15.50,
    orderDate: "2024-04-15",
    status: "Completed" as const,
  },
];

export default function IncomingOrders() {
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
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
        <h2 className="text-3xl font-display font-bold tracking-tight">Incoming Orders</h2>
        <p className="text-muted-foreground">
          Manage orders from buyers who purchased your books
        </p>
      </div>

      {mockIncomingOrders.length === 0 ? (
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
                  {mockIncomingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.buyerName}</TableCell>
                      <TableCell>{order.items}</TableCell>
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
                          onClick={() => {
                            toast({
                              title: "View Order",
                              description: `Viewing details for order ${order.id}`,
                            });
                          }}
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
