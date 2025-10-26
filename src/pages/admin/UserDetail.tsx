import { useParams, Link } from "react-router-dom";
import { getUserById, adminMockListings, adminMockOrders } from "@/lib/adminMockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Ban, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const user = getUserById(id || "");

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  // Mock user listings and orders
  const userListings = adminMockListings.filter(
    (listing) => listing.sellerName === user.name
  );
  const userOrders = adminMockOrders.filter(
    (order) => order.buyerName === user.name
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Profile */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge
                  variant={user.status === "Active" ? "default" : "destructive"}
                  className="mt-2"
                >
                  {user.status}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Books Listed</span>
                  <span className="text-sm font-medium">{userListings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Orders Placed</span>
                  <span className="text-sm font-medium">{userOrders.length}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: user.status === "Active" ? "User Suspended" : "User Activated",
                      description: `${user.name} has been ${user.status === "Active" ? "suspended" : "activated"}`,
                    });
                  }}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {user.status === "Active" ? "Suspend User" : "Activate User"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Password Reset",
                      description: `Password reset email sent to ${user.email}`,
                    });
                  }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - User Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="listings">
                <TabsList className="w-full">
                  <TabsTrigger value="listings" className="flex-1">
                    Book Listings ({userListings.length})
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">
                    Orders Placed ({userOrders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-4">
                  {userListings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No book listings yet
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userListings.map((listing) => (
                            <TableRow key={listing.id}>
                              <TableCell className="font-medium">{listing.title}</TableCell>
                              <TableCell>${listing.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    listing.status === "Available" ? "default" : "secondary"
                                  }
                                >
                                  {listing.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Link to={`/admin/listings/${listing.id}`}>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders placed yet
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                              <TableCell>
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
                              </TableCell>
                              <TableCell>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Link to={`/admin/orders/${order.id}`}>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
