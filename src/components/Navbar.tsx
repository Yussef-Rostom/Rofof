import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-2xl font-bold text-primary">Rofof</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/books" className="text-foreground hover:text-primary transition-colors">
              Browse Books
            </Link>
            <Link to="/dashboard/add-book" className="text-foreground hover:text-primary transition-colors">
              Sell a Book
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/books" className="text-foreground hover:text-primary transition-colors">
                Browse Books
              </Link>
              <Link to="/dashboard/add-book" className="text-foreground hover:text-primary transition-colors">
                Sell a Book
              </Link>
              <Link to="/cart" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                Cart (0)
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
