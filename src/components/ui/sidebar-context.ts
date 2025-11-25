import * as React from "react";
import { SIDEBAR_KEYBOARD_SHORTCUT } from "./sidebar-constants";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarContextType = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextType | null>(null);


