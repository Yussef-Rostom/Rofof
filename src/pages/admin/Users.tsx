import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminMockUsers, AdminUser } from "@/lib/adminMockData";
import { Eye, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredUsers = adminMockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "id",
      label: "User ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "registrationDate",
      label: "Registration Date",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (user: AdminUser) => (
        <Badge variant={user.status === "Active" ? "default" : "destructive"}>
          {user.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: AdminUser) => (
        <div className="flex gap-2">
          <Link to={`/admin/users/${user.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: user.status === "Active" ? "User Suspended" : "User Activated",
                description: `${user.name} has been ${user.status === "Active" ? "suspended" : "activated"}`,
              });
            }}
          >
            <Ban className="h-4 w-4 mr-1" />
            {user.status === "Active" ? "Suspend" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

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
      </div>

      <DataTable data={filteredUsers} columns={columns} />
    </div>
  );
}
