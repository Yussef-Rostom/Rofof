import { useState, useEffect, useCallback } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ErrorComponent } from "@/components/ErrorComponent";
import { categories } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, SearchX, PackageOpen } from "lucide-react";
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
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BrowseListings() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.listing);
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",") || []
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin")) || 0,
    Number(searchParams.get("priceMax")) || 50,
  ]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchParams((prev) => {
        if (query) {
          prev.set("search", query);
        } else {
          prev.delete("search");
        }
        prev.set("page", "1"); // Reset to page 1 on search
        return prev;
      });
    }, 500),
    [setSearchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      setSearchParams((params) => {
        if (newCategories.length > 0) {
          params.set("category", newCategories.join(","));
        } else {
          params.delete("category");
        }
        params.set("page", "1");
        return params;
      });

      return newCategories;
    });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    // Debounce price update to avoid too many API calls while sliding
    const timeoutId = setTimeout(() => {
      setSearchParams((params) => {
        params.set("priceMin", value[0].toString());
        params.set("priceMax", value[1].toString());
        params.set("page", "1");
        return params;
      });
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split(":");
    setSearchParams((params) => {
      params.set("sortBy", sortBy);
      params.set("order", order);
      params.set("page", "1");
      return params;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams((params) => {
      params.set("page", newPage.toString());
      return params;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    dispatch(fetchListings({
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12, // Or whatever limit you prefer
      sortBy: searchParams.get("sortBy") || 'createdAt',
      order: (searchParams.get("order") as 'asc' | 'desc') || 'desc',
    }));
  }, [dispatch, searchParams]);

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
            onChange={handleSearchChange}
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
          onValueChange={handlePriceChange}
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
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {loading ? "Searching..." : `Showing ${listings.length} results`}
              </p>
              <Select
                value={`${searchParams.get("sortBy") || "createdAt"}:${searchParams.get("order") || "desc"}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest</SelectItem>
                  <SelectItem value="createdAt:asc">Oldest</SelectItem>
                  <SelectItem value="price:asc">Price: Low to High</SelectItem>
                  <SelectItem value="price:desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            )}
            {error && (
              <ErrorComponent
                message={error}
                onRetry={() => dispatch(fetchListings({
                  search: searchParams.get("search") || undefined,
                  category: searchParams.get("category") || undefined,
                  priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
                  priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
                  page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
                  limit: 12,
                  sortBy: searchParams.get("sortBy") || 'createdAt',
                  order: (searchParams.get("order") as 'asc' | 'desc') || 'desc',
                }))}
                className="mt-8"
              />
            )}
            {!loading && !error && listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {searchParams.get("search") || searchParams.get("category") || searchParams.get("priceMin") || searchParams.get("priceMax") ? (
                  // Scenario 1: Filters active but no matches
                  <>
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                      <SearchX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">No matches found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      We couldn't find any listings matching your current filters. Try adjusting your search or removing some filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchParams({});
                        setSearchQuery("");
                        setSelectedCategories([]);
                        setPriceRange([0, 50]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </>
                ) : (
                  // Scenario 2: Database is empty (no filters active)
                  <>
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                      <PackageOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">No listings available</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      There are no listings in the marketplace yet. Be the first to share your collection with the community!
                    </p>
                    <Button onClick={() => window.location.href = '/dashboard/add-listing'}>
                      Start Selling
                    </Button>
                  </>
                )}
              </div>
            )}
            {!loading && !error && listings.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} {...listing} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(Number(currentPage) - 1);
                          }}
                          className={Number(currentPage) <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <div className="flex items-center px-4 text-sm font-medium">
                          Page {currentPage} of {totalPages}
                        </div>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(Number(currentPage) + 1);
                          }}
                          className={Number(currentPage) >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}