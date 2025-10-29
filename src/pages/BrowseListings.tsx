import { useState, useEffect } from "react";
import { ListingCard } from "@/components/ListingCard";
import { categories } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchListings } from "../store/listingSlice";
import { ListingCardSkeleton } from "@/components/ListingCardSkeleton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BrowseListings() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error } = useSelector((state: RootState) => state.listing);
  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(listing.category);
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const renderFilters = () => (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h2 className="font-display text-xl font-semibold mb-4">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <Label htmlFor="search" className="mb-2">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <Label className="mb-3">Categories</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <label
                htmlFor={category}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-3">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={50}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-4"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <h1 className="font-display text-4xl font-bold mb-8">Browse Listings</h1>

        <div className="flex justify-end lg:hidden mb-4">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filter Listings</SheetTitle>
              </SheetHeader>
              {renderFilters()}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="sticky top-20">
              {renderFilters()}
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            )}
            {error && <p className="text-center text-destructive text-lg">Error: {error}</p>}
            {!loading && !error && filteredListings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No listings found matching your criteria</p>
              </div>
            )}
            {!loading && !error && filteredListings.length > 0 && (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing._id} {...listing} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}