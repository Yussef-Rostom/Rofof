import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { Listing } from "@/types";

export default function MyListings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await api.get("/listings/my-listings");
        setListings(response.data);
      } catch (err) {
        setError("Failed to fetch listings.");
        toast({
          title: "Error",
          description: "Failed to fetch your listings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [toast]);

  const handleDelete = async (id: string, title: string) => {
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((listing) => listing._id !== id));
      toast({
        title: "Listing Deleted",
        description: `"${title}" has been removed from your listings.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete listing.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-bold tracking-tight">My Listings</h2>
        <p className="text-muted-foreground">Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-bold tracking-tight">My Listings</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">My Listings</h2>
          <p className="text-muted-foreground">Manage the items you're selling</p>
        </div>
        <Link to="/dashboard/add-listing">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List a New Item
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't listed any items yet.</p>
            <Link to="/dashboard/add-listing">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Your First Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing._id} className="overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">{listing.author}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">${listing.price.toFixed(2)}</p>
                  <Badge variant={listing.condition === "Available" ? "default" : "secondary"}>
                    {listing.condition}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  Condition: {listing.condition}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      navigate(`/dashboard/add-listing/${listing._id}`);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{listing.title}"? This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(listing._id, listing.title)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
