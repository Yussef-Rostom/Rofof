import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { totalQuantity } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

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
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed right-0 top-16 bottom-0 w-3/4 max-w-sm bg-card p-4 overflow-y-auto transition-transform duration-300 ease-in-out transform md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-4">
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
            <Link
              to="/cart"
              className="flex items-center gap-2 text-foreground hover:text-primary hover:bg-accent transition-colors py-2 px-3 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart ({totalQuantity})
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
                <>
                  <Link
                    to="/account"
                    className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full py-2 px-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="text-foreground hover:text-primary hover:bg-accent transition-colors w-full text-left py-2 px-3 rounded-md"
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                  >
                    Logout
                  </button>
                </>
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
