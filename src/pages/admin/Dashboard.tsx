import { StatCard } from "@/components/admin/StatCard";
import { Users, BookOpen, ShoppingCart, DollarSign } from "lucide-react";
import { adminMockUsers, adminMockListings, adminMockOrders } from "@/lib/adminMockData";

export default function Dashboard() {
  const totalUsers = adminMockUsers.length;
  const totalListings = adminMockListings.length;
  const totalOrders = adminMockOrders.length;
  const totalRevenue = adminMockOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of platform statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description="Registered users on platform"
        />
        <StatCard
          title="Total Listings"
          value={totalListings}
          icon={BookOpen}
          description="Active book listings"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          description="Orders placed"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="Platform revenue"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {adminMockOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.buyerName}</p>
                  <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                </div>
                <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <span className="font-semibold">
                {adminMockUsers.filter((u) => u.status === "Active").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Books</span>
              <span className="font-semibold">
                {adminMockListings.filter((l) => l.status === "Available").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Orders</span>
              <span className="font-semibold">
                {adminMockOrders.filter((o) => o.status === "Pending").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
