import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import api from "@/lib/api";

import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types";
import { Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingsPageSkeleton from "@/pages/admin/ListingsPageSkeleton";

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [toast]);

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "title",
      label: "Listing Title",
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
      render: (listing: Listing) => `$${listing.price?.toFixed(2) || "0.00"}`,
    },
    {
      key: "status",
      label: "Status",
      render: (listing: Listing) => (
        <Badge
          variant={listing.status === "Available" ? "default" : "secondary"}
        >
          {listing.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (listing: Listing) => (
        <div className="flex gap-2">
          <Link to={`/admin/listings/${listing._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Button
            variant="destructive"
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

  if (loading) {
    return <ListingsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">
          Listings
        </h2>
        <p className="text-muted-foreground">
          Manage all listings on the platform
        </p>
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
