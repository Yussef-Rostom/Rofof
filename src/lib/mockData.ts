export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair";
  category: string;
  imageUrl: string;
  images: string[];
  sellerId: number;
}

export interface Seller {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    price: 12.99,
    condition: "Good",
    category: "Classic Literature",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600",
    ],
    sellerId: 1,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    price: 15.50,
    condition: "Like New",
    category: "Classic Literature",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600",
    ],
    sellerId: 2,
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
    price: 13.99,
    condition: "Good",
    category: "Science Fiction",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600",
    ],
    sellerId: 1,
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners following the character development of Elizabeth Bennet.",
    price: 11.99,
    condition: "Fair",
    category: "Romance",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600",
    ],
    sellerId: 3,
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A story about teenage rebellion and alienation.",
    price: 14.50,
    condition: "Good",
    category: "Coming of Age",
    imageUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600",
    ],
    sellerId: 2,
  },
  {
    id: 6,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description: "The first book in the beloved Harry Potter series about a young wizard.",
    price: 16.99,
    condition: "New",
    category: "Fantasy",
    imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=600",
    images: [
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=600",
    ],
    sellerId: 3,
  },
];

export const mockSellers: Seller[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 4.8,
    totalSales: 127,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 4.9,
    totalSales: 89,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 4.7,
    totalSales: 156,
  },
];

export const categories = [
  "Classic Literature",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "History",
  "Coming of Age",
];
