import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";

export function UserNavMobile() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Link to="/account" className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={user?.profile?.avatarUrl || ""}
          alt={user?.fullName}
        />
        <AvatarFallback>{user?.fullName?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </Link>
  );
}
