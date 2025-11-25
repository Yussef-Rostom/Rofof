import { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { Users, BookOpen, ShoppingCart, DollarSign } from "lucide-react";
import { getDashboardStats } from "@/lib/api";
import { Link } from "react-router-dom";
import DashboardSkeleton from "@/components/admin/DashboardSkeleton";
import { AxiosError } from "axios";

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
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch dashboard data";
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
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
