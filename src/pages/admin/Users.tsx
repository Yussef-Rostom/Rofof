import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { User } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddUserForm } from "@/components/admin/AddUserForm";
import { Trash } from "lucide-react";
import { isAxiosError, AxiosError } from "axios";
import UsersPageSkeleton from "@/pages/admin/UsersPageSkeleton";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentLoggedInUser = useSelector((state: RootState) => state.user.user);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId: string, checked: boolean) => {
    if (!currentLoggedInUser) {
      toast({
        title: "Error",
        description: "You must be logged in to change roles.",
        variant: "destructive",
      });
      return;
    }

    if (userId === currentLoggedInUser._id) {
      toast({
        title: "Error",
        description: "You cannot change your own role.",
        variant: "destructive",
      });
      return;
    }

    const newRole = checked ? "admin" : "user";
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });
      fetchUsers(); // Refresh the user list
    } catch (error: unknown) {
      let errorMessage = "Failed to update user role.";
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

  const handleDeleteUser = async (userId: string) => {
    if (!currentLoggedInUser) {
      toast({
        title: "Error",
        description: "You must be logged in to delete users.",
        variant: "destructive",
      });
      return;
    }

    if (userId === currentLoggedInUser._id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers(); // Refresh the user list
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
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "_id",
      label: "User ID",
      sortable: true,
    },
    {
      key: "fullName",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role}
          </Badge>
          <Switch
            checked={user.role === "admin"}
            onCheckedChange={(checked) => handleRoleChange(user._id, checked)}
            disabled={user._id === currentLoggedInUser?._id} // Disable if it's the current logged-in user
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <div className="flex gap-2">
          <Link to={`/admin/users/${user._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={user._id === currentLoggedInUser?._id}>
                <Trash className="h-4 w-4 mr-1" />
                Remove
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
                <AlertDialogAction onClick={() => handleDeleteUser(user._id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (loading) {
    return <UsersPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      <div className="flex justify-between items-center">
        <SearchBar
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new user account.
              </DialogDescription>
            </DialogHeader>
            <AddUserForm
              onUserAdded={fetchUsers}
              onClose={() => setIsAddUserDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable data={filteredUsers} columns={columns} />
    </div>
  );
}
