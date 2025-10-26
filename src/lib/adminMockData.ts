export interface AdminUser {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "Active" | "Suspended";
}

export interface AdminBookListing {
  id: string;
  title: string;
  author: string;
  sellerName: string;
  price: number;
  status: "Available" | "Sold";
}

export interface AdminOrder {
  id: string;
  buyerName: string;
  totalPrice: number;
  orderDate: string;
  status: "Pending" | "Shipped" | "Completed";
}

export const adminMockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    registrationDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    registrationDate: "2024-02-20",
    status: "Active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    registrationDate: "2024-03-10",
    status: "Active",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    registrationDate: "2024-03-25",
    status: "Suspended",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    registrationDate: "2024-04-05",
    status: "Active",
  },
];

export const adminMockListings: AdminBookListing[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    sellerName: "Sarah Johnson",
    price: 12.99,
    status: "Available",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    sellerName: "Michael Chen",
    price: 15.50,
    status: "Available",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    sellerName: "Sarah Johnson",
    price: 13.99,
    status: "Sold",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    sellerName: "Emily Rodriguez",
    price: 11.99,
    status: "Available",
  },
  {
    id: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    sellerName: "Michael Chen",
    price: 14.50,
    status: "Available",
  },
];

export const adminMockOrders: AdminOrder[] = [
  {
    id: "ORD-001",
    buyerName: "David Kim",
    totalPrice: 45.98,
    orderDate: "2024-04-15",
    status: "Completed",
  },
  {
    id: "ORD-002",
    buyerName: "Lisa Anderson",
    totalPrice: 28.49,
    orderDate: "2024-04-16",
    status: "Shipped",
  },
  {
    id: "ORD-003",
    buyerName: "Sarah Johnson",
    totalPrice: 62.97,
    orderDate: "2024-04-17",
    status: "Pending",
  },
  {
    id: "ORD-004",
    buyerName: "Michael Chen",
    totalPrice: 15.50,
    orderDate: "2024-04-18",
    status: "Pending",
  },
  {
    id: "ORD-005",
    buyerName: "Emily Rodriguez",
    totalPrice: 39.98,
    orderDate: "2024-04-19",
    status: "Completed",
  },
];

// Helper functions to get individual items by ID
export const getUserById = (id: string): AdminUser | undefined => {
  return adminMockUsers.find((user) => user.id === id);
};

export const getListingById = (id: string): AdminBookListing | undefined => {
  return adminMockListings.find((listing) => listing.id === id);
};

export const getOrderById = (id: string): AdminOrder | undefined => {
  return adminMockOrders.find((order) => order.id === id);
};
