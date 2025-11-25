import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { Link, Outlet, useLocation } from "react-router-dom";
import {
  BookOpen,
  CircleUser,
  Menu,
  Home,
  Gauge,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { accountNavItems } from "@/components/account/accountNavItems";
import { AdminBreadcrumb } from "@/components/admin/Breadcrumb";


export default function AccountLayout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const title = pathnames[pathnames.length - 1];

  const user = useSelector((state: RootState) => state.user.user);
  const isAdmin = user?.role === "admin";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AccountSidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="sr-only">Rofof</span>
                </Link>
                {accountNavItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1"></div> {/* This will push the buttons to the right */}
          <Link to="/">
            <Button variant="outline" size="sm">
              Home
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          )}


        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl capitalize">
              {title}
            </h1>
          </div>
          <AdminBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
}