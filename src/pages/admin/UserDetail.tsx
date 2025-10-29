import { useParams, Link, useNavigate } from "react-router-dom";
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
import { ArrowLeft, UserCheck, UserX, MoreVertical, Key, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User, Listing, OrderData } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isAxiosError } from "axios";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const currentLoggedInUser = useSelector((state: RootState) => state.user.user);

  const fetchUserData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const userResponse = await api.get<User>(`/admin/users/${id}`);
      setUser(userResponse.data);

      // Assuming endpoints for user's listings and orders
      // These might need adjustment based on actual API design
      const listingsResponse = await api.get<Listing[]>(`/admin/users/${id}/listings`);
      setUserListings(listingsResponse.data);

      const ordersResponse = await api.get<OrderData[]>(`/admin/users/${id}/orders`);
      setUserOrders(ordersResponse.data);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, toast]);

  const handleRoleChange = async (newRole: "user" | "admin") => {
    if (!user || !currentLoggedInUser) {
      toast({
        title: "Error",
        description: "Authentication error or user not found.",
        variant: "destructive",
      });
      return;
    }

    if (user._id === currentLoggedInUser._id) {
      toast({
        title: "Error",
        description: "You cannot change your own role.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });
      fetchUserData(); // Refresh user data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const handleResetPassword = async () => {
    if (!user) return;
    const newPassword = generateRandomPassword();
    try {
      await api.post(`/admin/users/${user._id}/reset-password`, { newPassword });
      toast({
        title: "Password Reset",
        description: `Password for ${user.email} reset to: ${newPassword}. Please communicate this securely to the user.`, // Display generated password
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !currentLoggedInUser) {
      toast({
        title: "Error",
        description: "Authentication error or user not found.",
        variant: "destructive",
      });
      return;
    }

    if (user._id === currentLoggedInUser._id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.delete(`/admin/users/${user._id}`);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      navigate("/admin/users"); // Redirect to user list after deletion
    } catch (error: unknown) {
      let errorMessage = "Failed to delete user.";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading user details...</div>;
  }

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

  const isCurrentUser = user._id === currentLoggedInUser?._id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <h2 className="text-3xl font-display font-bold tracking-tight">{user.fullName}</h2>
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
                  <AvatarImage src={user.profile.avatarUrl} />
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="mt-2"
                >
                  {user.role}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Listings Listed</span>
                  <span className="text-sm font-medium">{userListings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Orders Placed</span>
                  <span className="text-sm font-medium">{userOrders.length}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full" disabled={isCurrentUser}>
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange("admin")}
                      disabled={user.role === "admin"}
                    >
                      <UserCheck className="h-4 w-4 mr-2" /> Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange("user")}
                      disabled={user.role === "user"}
                    >
                      <UserX className="h-4 w-4 mr-2" /> Make User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetPassword}
                  disabled={isCurrentUser}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={isCurrentUser}>
                      <Trash className="h-4 w-4 mr-2" />
                      Remove User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        user account and remove their data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                    Listings ({userListings.length})
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">
                    Orders Placed ({userOrders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-4">
                  {userListings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No listings by this user
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userListings.map((listing) => (
                            <TableRow key={listing._id}>
                              <TableCell className="font-medium">{listing.title}</TableCell>
                              <TableCell>${listing.price.toFixed(2)}</TableCell>
                              <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Link to={`/admin/listings/${listing._id}`}>
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
                      No orders placed by this user
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userOrders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell className="font-medium">{order._id}</TableCell>
                              <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                              <TableCell>{order.paymentMethod}</TableCell>
                              <TableCell>
                                <Link to={`/admin/orders/${order._id}`}>
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

