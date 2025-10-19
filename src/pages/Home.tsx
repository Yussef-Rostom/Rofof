import { Link } from "react-router-dom";
import { Search, BookOpen, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/BookCard";
import { mockBooks } from "@/lib/mockData";

export default function Home() {
  const featuredBooks = mockBooks.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next Great Read
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Buy and sell pre-loved books in a community of readers
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto bg-card rounded-lg p-2 shadow-elegant">
              <Input 
                placeholder="Search for books, authors, or categories..." 
                className="border-0 focus-visible:ring-0 bg-transparent text-foreground"
              />
              <Button variant="default" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Vast Selection</h3>
              <p className="text-muted-foreground">
                Thousands of books across all genres and categories
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">
                Safe and protected buying and selling experience
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                Great deals on quality pre-loved books
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Newest Additions</h2>
            <Link to="/books">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 warm-gradient">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Have Books to Sell?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn your bookshelf into cash. List your books in minutes and reach thousands of potential buyers.
          </p>
          <Link to="/dashboard/add-book">
            <Button variant="hero" size="lg">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
