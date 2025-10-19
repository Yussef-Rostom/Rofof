import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { mockBooks, categories } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

export default function BrowseBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(book.category);
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <h1 className="font-display text-4xl font-bold mb-8">Browse Books</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
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
          </aside>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            <p className="text-muted-foreground mb-6">
              Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
            </p>
            
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No books found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
