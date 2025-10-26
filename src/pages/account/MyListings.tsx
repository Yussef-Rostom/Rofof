import { useState } from "react";
import { Link } from "react-router-dom";
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

// Mock data for user's listings
const mockUserListings = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    condition: "Like New",
    status: "Available",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    condition: "Good",
    status: "Sold",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 15.50,
    condition: "Very Good",
    status: "Available",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
  },
];

export default function MyListings() {
  const { toast } = useToast();
  const [listings, setListings] = useState(mockUserListings);

  const handleDelete = (id: string, title: string) => {
    setListings(listings.filter((listing) => listing.id !== id));
    toast({
      title: "Listing Deleted",
      description: `"${title}" has been removed from your listings.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">My Book Listings</h2>
          <p className="text-muted-foreground">Manage the books you're selling</p>
        </div>
        <Link to="/dashboard/add-book">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List a New Book
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't listed any books yet.</p>
            <Link to="/dashboard/add-book">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Your First Book
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={listing.image}
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
                  <Badge variant={listing.status === "Available" ? "default" : "secondary"}>
                    {listing.status}
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
                      toast({
                        title: "Edit Listing",
                        description: "Edit functionality coming soon",
                      });
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
                          onClick={() => handleDelete(listing.id, listing.title)}
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
