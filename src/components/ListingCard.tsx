import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';
import { RootState } from "@/store";

interface ListingCardProps {
  _id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  imageUrls?: string[]; // Made optional
}

export const ListingCard = ({ _id, title, author, price, condition, category, imageUrls }: ListingCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(addItemToCart({ listingId: _id, quantity: 1 }));
  };

  return (
    <Card className="listing-card-hover shadow-card overflow-hidden h-full">
      <Link to={`/listings/${_id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2">{title}</h3>
            <Badge variant="secondary" className="shrink-0 text-xs">{condition}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{author}</p>
          <Badge variant="outline" className="text-xs">{category}</Badge>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-display text-2xl font-semibold text-primary">${price}</p>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};
