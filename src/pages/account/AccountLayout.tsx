import { Outlet, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, ShoppingBag, Package, ShoppingCart } from "lucide-react";

const accountNavItems = [
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

function AccountSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AccountLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AccountSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger className="-ml-1" />
            <h1 className="ml-4 text-xl font-display font-semibold">
              My Account
            </h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
