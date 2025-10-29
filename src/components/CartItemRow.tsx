import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { removeItemFromCart } from "@/store/cartSlice";
import { AppDispatch } from "@/store";
import { Listing } from "@/types";

interface CartItemProps {
  item: {
    _id: string;
    listing: Listing;
    quantity: number;
  };
}

const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const handleRemoveItem = async (itemId: string) => {
    try {
      await dispatch(removeItemFromCart(itemId)).unwrap();
      toast({
        title: "Item Removed",
        description: "Item successfully removed from your cart.",
      });
    } catch (err: any) {
      toast({
        title: "Failed to remove item",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={item._id} className="flex items-center p-4">
      <img src={item.listing.imageUrls?.[0] || "/placeholder.svg"} alt={item.listing.title} className="w-20 h-24 object-cover rounded-md mr-4" />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.listing.title}</h3>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">Quantity: {item.quantity}</p>
        </div>
        <p className="font-semibold">${item.listing.price ? item.listing.price.toFixed(2) : '0.00'}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item._id)}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </Card>
  );
};

export default CartItemRow;
