import { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { Users, BookOpen, ShoppingCart, DollarSign } from "lucide-react";
import { getDashboardStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: {
    _id: string;
    buyer: { fullName: string };
    createdAt: string;
    totalPrice: number;
  }[];
  activeUsers: number;
  availableListings: number;
  pendingOrders: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDashboardStats();
        setDashboardData(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[30px] w-[200px]" />
        <Skeleton className="h-[20px] w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of platform statistics</p>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of platform statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={Users}
          description="Registered users on platform"
        />
        <StatCard
          title="Total Listings"
          value={dashboardData.totalListings}
          icon={BookOpen}
          description="Active listings"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon={ShoppingCart}
          description="Orders placed"
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="Platform revenue"
        />
      </div>

    </div>
  );
}
