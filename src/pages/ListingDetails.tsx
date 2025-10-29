import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchListingDetails, clearCurrentListing } from "@/store/listingSlice";
import { addItemToCart } from "@/store/cartSlice";

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { currentListing: listing, currentSeller: seller, loading, error } = useSelector((state: RootState) => state.listing);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchListingDetails(id));
    }
    return () => {
      dispatch(clearCurrentListing());
    };
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (listing) {
      dispatch(addItemToCart({ listingId: listing._id, quantity: 1 }));
      toast({
        title: "Added to cart",
        description: `${listing.title} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="aspect-square rounded" />
                <Skeleton className="aspect-square rounded" />
                <Skeleton className="aspect-square rounded" />
                <Skeleton className="aspect-square rounded" />
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-1/4 mb-6" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-24 w-full mb-8" />
              <Skeleton className="h-32 w-full mb-8" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Error</h1>
          <p className="text-lg text-muted-foreground mb-4">{error}</p>
          <Link to="/listings">
            <Button variant="outline">Browse Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!listing || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Listing Not Found</h1>
          <Link to="/listings">
            <Button variant="outline">Browse Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <Link to="/listings" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div>
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={listing.imageUrls?.[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.imageUrls && listing.imageUrls.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {listing.imageUrls.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={img} alt={`${listing.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold mb-2">{listing.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{listing.author}</p>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{listing.condition}</Badge>
                <Badge variant="outline">{listing.category}</Badge>
              </div>
              <p className="font-display text-4xl font-bold text-primary mb-6">${listing.price}</p>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>{seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-accent text-accent mr-1" />
                        <span>{seller.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{seller.totalSales} sales</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
