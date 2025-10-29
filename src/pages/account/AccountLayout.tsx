import { Outlet, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  const { open } = useSidebar();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Sidebar collapsible="icon" className="mt-16">
      <SidebarContent>
        {open && user && (
          <div className="flex items-center gap-3 p-2 mb-4 hover:bg-accent/50 rounded-md transition-colors cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{user.fullName}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>My Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="group hover:bg-accent/50 rounded-md transition-colors">
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 text-foreground transition-colors py-2 px-3 rounded-md ${isActive ? "bg-accent font-medium is-active border-l-4 border-primary" : ""}`
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
