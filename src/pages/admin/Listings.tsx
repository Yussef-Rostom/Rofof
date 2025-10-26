import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminMockListings, AdminBookListing } from "@/lib/adminMockData";
import { Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredListings = adminMockListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "title",
      label: "Book Title",
      sortable: true,
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
    },
    {
      key: "sellerName",
      label: "Seller",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (listing: AdminBookListing) => `$${listing.price.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (listing: AdminBookListing) => (
        <Badge variant={listing.status === "Available" ? "default" : "secondary"}>
          {listing.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (listing: AdminBookListing) => (
        <div className="flex gap-2">
          <Link to={`/admin/listings/${listing.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Listing Removed",
                description: `"${listing.title}" has been removed from the platform`,
                variant: "destructive",
              });
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Book Listings</h2>
        <p className="text-muted-foreground">Manage all book listings on the platform</p>
      </div>

      <div className="flex justify-between items-center">
        <SearchBar
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <DataTable data={filteredListings} columns={columns} />
    </div>
  );
}
