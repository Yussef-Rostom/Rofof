export interface Listing {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrls?: string[];
  seller: ListingSeller; // Nested seller object
  createdAt: string;
  status: "Available" | "Unavailable";
}

export interface ListingSeller {
  _id: string;
  fullName: string;
  email: string;
  profile: {
    avatarUrl: string;
    bio: string;
  };
}

export interface Seller {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
}

export interface UserProfile {
  bio: string;
  avatarUrl: string;
}

export interface SellerStats {
  averageRating: number;
  totalSales: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  profile: UserProfile;
  sellerStats: SellerStats;
  address?: Address; // Changed to Address interface
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartItem {
  listing: Listing;
  quantity: number;
  _id: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface AccountState {
  profileLoading: boolean;
  emailLoading: boolean;
  passwordLoading: boolean;
  uploadLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface ListingState {
  listings: Listing[];
  featuredListings: Listing[];
  currentListing: Listing | null;
  currentSeller: Seller | null;
  loading: boolean;
  uploadLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface EmbeddedListing {
  listingId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  listingId: string;
  title: string; // Added title
  quantity: number;
  price: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface OrderData {
  _id: string;
  buyer: User; // Changed from string to User
  seller: User; // Added seller
  listingInfo: EmbeddedListing;
  totalPrice: number; // Changed from totalAmount to totalPrice
  paymentMethod: string;
  shippingAddress: Address;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "Active" | "Suspended";
}

export interface AdminListing {
  id: string;
  title: string;
  author: string;
  sellerName: string;
  price: number;
  status: "Available" | "Sold";
}
