import { Link } from "react-router-dom";
import { ErrorComponent } from "@/components/ErrorComponent";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { ListingCardSkeleton } from "@/components/ListingCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchFeaturedListings } from "../store/listingSlice";
import { useEffect } from "react";
import { ShoppingBag, Handshake, Tag } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredListings, loading, error } = useSelector(
    (state: RootState) => state.listing
  );

  useEffect(() => {
    dispatch(fetchFeaturedListings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[550px] bg-primary text-white overflow-hidden">
        <div className="container-custom text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl space-y-6 z-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover Your Next Great Find
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Buy and sell pre-loved items in a community of enthusiasts
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link to="/listings">
                <Button
                  size="lg"
                  variant="hero"
                  className="text-primary-foreground"
                >
                  Browse Listings
                </Button>
              </Link>
              <Link to="/dashboard/add-listing">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-secondary-foreground"
                >
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex items-center justify-center relative">
            {/* Abstract shapes for visual interest */}
            <div className="w-64 h-64 bg-accent rounded-full absolute top-1/4 left-1/4 opacity-10 blur-3xl"></div>
            <div className="w-48 h-48 bg-secondary rounded-full absolute bottom-1/4 right-1/4 opacity-15 blur-2xl"></div>
            <div className="w-32 h-32 bg-primary rounded-full absolute top-1/2 right-1/2 opacity-20 blur-xl"></div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Discover Unique Items</h3>
              <p className="mt-2 text-muted-foreground">
                Explore a vast collection of pre-loved treasures.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Community</h3>
              <p className="mt-2 text-muted-foreground">
                Buy and sell with confidence in a secure environment.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Tag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Great Deals</h3>
              <p className="mt-2 text-muted-foreground">
                Find amazing products at even better prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="bg-secondary/30 py-16 sm:py-24">
        <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Newest Additions
            </h2>
            <Link to="/listings">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ListingCardSkeleton key={index} />
              ))}
            </div>
          )}
          {error && (
            <div className="py-8">
              <ErrorComponent
                message={error}
                onRetry={() => dispatch(fetchFeaturedListings())}
              />
            </div>
          )}
          {!loading && !error && featuredListings.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-lg text-muted-foreground">
                No featured listings available
              </p>
            </div>
          )}
          {!loading && !error && featuredListings.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing._id} {...listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to declutter?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join our community of sellers and start earning today. It's simple
            and fast.
          </p>
          <div className="mt-8">
            <Link to="/dashboard/add-listing">
              <Button size="lg" variant="default">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
