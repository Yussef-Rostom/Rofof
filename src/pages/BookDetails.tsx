import { useParams, Link } from "react-router-dom";
import { mockBooks, mockSellers } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function BookDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const book = mockBooks.find((b) => b.id === Number(id));
  const seller = book ? mockSellers.find((s) => s.id === book.sellerId) : null;

  if (!book || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Book Not Found</h1>
          <Link to="/books">
            <Button variant="outline">Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <Link to="/books" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div>
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            {book.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {book.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={img} alt={`${book.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{book.condition}</Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
              <p className="font-display text-4xl font-bold text-primary mb-6">${book.price}</p>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
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
