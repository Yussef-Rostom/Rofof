import {
    BookOpen,
    LayoutDashboard,
    ShoppingCart,
    Users,
  } from "lucide-react";
  
  export const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Listings",
      url: "/admin/listings",
      icon: BookOpen,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
  ];
  