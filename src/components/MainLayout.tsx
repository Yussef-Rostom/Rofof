import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import TransitionWrapper from "./TransitionWrapper";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        <Outlet />
      </TransitionWrapper>
    </>
  );
}
