import { Link } from "react-router-dom";
import { BookOpen, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { useState } from "react";
import { UserNav } from "./UserNav";
import { UserNavMobile } from "./UserNavMobile";
import { logoutUser } from "../store/userSlice";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { totalQuantity } = useSelector((state: RootState) => state.cart);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container-custom px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-2xl font-bold text-primary">
              Rofof
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/listings"
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              to="/dashboard/add-listing"
              className="text-foreground hover:text-primary transition-colors"
            >
              Sell a Listing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <div className="hidden md:block">
              {isAuthenticated ? (
                <UserNav />
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed right-0 top-16 bottom-0 w-3/4 max-w-sm bg-card p-4 overflow-y-auto transition-transform duration-300 ease-in-out transform md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-4">
            {isAuthenticated && (
              <div className="border-b border-border pb-4">
                <UserNavMobile />
              </div>
            )}
            <Link
              to="/listings"
              className="text-foreground hover:text-primary hover:bg-accent transition-colors py-2 px-3 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Browse Listings
            </Link>
            <Link
              to="/dashboard/add-listing"
              className="text-foreground hover:text-primary hover:bg-accent transition-colors py-2 px-3 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Sell a Listing
            </Link>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full py-2 px-3 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full text-left py-2 px-3 rounded-md"
                  onClick={() => {
                    dispatch(logoutUser());
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full py-2 px-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full py-2 px-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
