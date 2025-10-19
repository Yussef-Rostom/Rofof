import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  condition: string;
  category: string;
  imageUrl: string;
}

export const BookCard = ({ id, title, author, price, condition, category, imageUrl }: BookCardProps) => {
  return (
    <Link to={`/books/${id}`} className="block">
      <Card className="book-card-hover shadow-card overflow-hidden h-full">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
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
        <CardFooter className="p-4 pt-0">
          <p className="font-display text-2xl font-semibold text-primary">${price}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};
