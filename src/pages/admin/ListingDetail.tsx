import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
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
import { Listing, User } from "@/types";
import ListingDetailsSkeleton from "@/components/ListingDetailsSkeleton"; // Import the skeleton component

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingAndSeller = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const listingResponse = await api.get(`/admin/listings/${id}`);
        setListing(listingResponse.data);

        const sellerResponse = await api.get(
          `/admin/users/${listingResponse.data.seller._id}`
        );
        setSeller(sellerResponse.data);
      } catch (err) {
        console.error("Error fetching listing details:", err);
        setError("Failed to load listing details.");
        toast({
          title: "Error",
          description: "Failed to load listing details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchListingAndSeller();
  }, [id, toast]);

  const handleRemoveListing = async () => {
    try {
      await api.delete(`/admin/listings/${id}`);
      toast({
        title: "Listing Removed",
        description: `"${listing?.title}" has been removed from the platform`,
        variant: "destructive",
      });
      navigate("/admin/listings");
    } catch (err) {
      console.error("Error removing listing:", err);
      toast({
        title: "Error",
        description: "Failed to remove listing.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ListingDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/listings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load listing details.</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/listings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Listing not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/listings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Listing Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Listing Images */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src={listing.imageUrls?.[0] || "/placeholder.png"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Listing Information */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold">{listing.title}</h2>
                  <p className="text-lg text-muted-foreground">by {listing.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{listing.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{listing.condition}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Meta & Admin */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sold by</p>
                {seller ? (
                  <Link to={`/admin/users/${seller._id}`}>
                    <Button variant="link" className="p-0 h-auto font-medium">
                      {seller.fullName}
                    </Button>
                  </Link>
                ) : (
                  <p className="font-medium">Loading seller...</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-2xl font-bold">${listing.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Badge variant={listing.status === "Available" ? "default" : "secondary"}>
                  {listing.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Listing
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{listing.title}" from the platform. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveListing}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



