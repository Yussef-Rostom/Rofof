import { NavLink } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { menuItems } from "./adminMenuItems";

export function AdminSidebar() {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="h-6 w-6 text-primary">Rofof</span>
          </NavLink>
        </div>
        <div className="flex-1">
          {user && (
            <div className="flex items-center gap-3 p-2 mb-4 hover:bg-accent/50 rounded-md transition-colors cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profile?.avatarUrl || ""} alt={user.fullName} />
                <AvatarFallback>{user.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {user.fullName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          )}
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : ""
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
