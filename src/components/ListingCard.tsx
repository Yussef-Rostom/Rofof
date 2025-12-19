import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';
import { RootState, AppDispatch } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "./ui/spinner";

import { ListingSeller } from "@/types";
import { CheckCircle } from "lucide-react";

interface ListingCardProps {
  _id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  imageUrls?: string[]; // Made optional
  seller?: ListingSeller;
}

export const ListingCard = ({ _id, title, author, price, condition, category, imageUrls, seller }: ListingCardProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { items: cartItems, status: cartStatus, loadingItemId } = useSelector((state: RootState) => state.cart);

  const isAddingToCart = loadingItemId === _id;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const isAlreadyInCart = cartItems.some(item => (typeof item.listing === 'object' ? item.listing._id : item.listing) === _id);

    if (isAlreadyInCart) {
      toast({
        title: "Already in cart",
        description: `${title} is already in your cart.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(addItemToCart({ listingId: _id, quantity: 1 })).unwrap();
      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart.`,
      });
    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      toast({
        title: "Failed to add to cart",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="listing-card-hover shadow-card overflow-hidden h-full flex flex-col group">
      <Link to={`/listings/${_id}`} className="block flex-grow">
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <img
            src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {seller?.sellerStats?.totalSales !== undefined && seller.sellerStats.totalSales > 5 && (
            <Badge className="absolute top-2 left-2 z-10 gap-1.5 px-2 py-1 bg-green-600/90 text-white border-none backdrop-blur-sm shadow-sm hover:bg-green-600">
              <CheckCircle className="w-3.5 h-3.5" />
              Trusted Seller
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
            <Badge variant="secondary" className="shrink-0 text-xs">{condition}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{author}</p>
          <Badge variant="outline" className="text-xs">{category}</Badge>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
        <p className="font-display text-2xl font-semibold text-primary">${price}</p>
        <Button onClick={handleAddToCart} disabled={isAddingToCart} className="z-10 relative">
          {isAddingToCart ? <Spinner size="sm" className="text-primary-foreground" /> : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
