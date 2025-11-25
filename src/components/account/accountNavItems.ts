import {
    User,
    ShoppingBag,
    Package,
    ShoppingCart,
  } from "lucide-react";
  
  export const accountNavItems = [
    {
      title: "Profile Settings",
      url: "/account/profile",
      icon: User,
    },
    {
      title: "My Listings",
      url: "/account/listings",
      icon: ShoppingBag,
    },
    {
      title: "Incoming Orders",
      url: "/account/orders",
      icon: Package,
    },
    {
      title: "Purchase History",
      url: "/account/purchases",
      icon: ShoppingCart,
    },
  ];
  