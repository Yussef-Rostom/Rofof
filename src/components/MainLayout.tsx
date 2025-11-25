import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import TransitionWrapper from "./TransitionWrapper";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TransitionWrapper>
        <Outlet />
      </TransitionWrapper>
    </div>
  );
}
