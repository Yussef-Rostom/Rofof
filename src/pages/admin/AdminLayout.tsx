import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col ">
          <header className="h-16 border-b bg-background flex items-center px-6">
            <SidebarTrigger className="-ml-1" />
            <h1 className="ml-4 text-xl font-display font-semibold">
              Admin Dashboard
            </h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30 ">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
