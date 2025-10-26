import { useParams, Link } from "react-router-dom";
import { getListingById, adminMockUsers } from "@/lib/adminMockData";
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

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const listing = getListingById(id || "");

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

  // Find seller user to get their ID
  const seller = adminMockUsers.find((user) => user.name === listing.sellerName);

  const handleRemoveListing = () => {
    toast({
      title: "Listing Removed",
      description: `"${listing.title}" has been removed from the platform`,
      variant: "destructive",
    });
  };

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
        {/* Left Column - Book Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Book Images */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src={`https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book Information */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold">{listing.title}</h2>
                  <p className="text-lg text-muted-foreground">by {listing.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">Fiction</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">Like New</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm leading-relaxed">
                    A timeless classic exploring themes of wealth, love, and the American Dream.
                    This beautifully preserved edition is in excellent condition with minimal wear.
                    Perfect for collectors and readers alike.
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
                  <Link to={`/admin/users/${seller.id}`}>
                    <Button variant="link" className="p-0 h-auto font-medium">
                      {listing.sellerName}
                    </Button>
                  </Link>
                ) : (
                  <p className="font-medium">{listing.sellerName}</p>
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Edit Listing",
                    description: "Edit functionality coming soon",
                  });
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </Button>

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
