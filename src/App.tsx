import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/userSlice";
import { AppDispatch, RootState } from "./store";
import { Navbar } from "@/components/Navbar";
import TransitionWrapper from "./components/TransitionWrapper"; // Import TransitionWrapper
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Home from "./pages/Home";
import BrowseListings from "./pages/BrowseListings";
import ListingDetails from "./pages/ListingDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AddListing from "./pages/AddListing";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Listings from "././pages/admin/Listings";
import ListingDetail from "./pages/admin/ListingDetail";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import MyListings from "./pages/account/MyListings";
import IncomingOrders from "@/pages/account/IncomingOrders";
import PurchaseHistory from "./pages/account/PurchaseHistory";
import UserOrderDetail from "./pages/account/UserOrderDetail"; // Import UserOrderDetail
import NotFound from "./pages/NotFound";
import { fetchCart } from "./store/cartSlice";

// This is a dummy comment to force re-transpilation
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: userLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await dispatch(fetchMe());
      }
      setIsAuthCheckComplete(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    // Fetch cart only if user is authenticated after the initial check
    if (!userLoading && isAuthCheckComplete && isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, userLoading, isAuthCheckComplete, isAuthenticated]);

  if (!isAuthCheckComplete) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Navbar />
          <TransitionWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<BrowseListings />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/dashboard/add-listing/:id?"
                  element={<AddListing />}
                />
                {/* Account Routes */}
                <Route path="/account" element={<AccountLayout />}>
                  <Route index element={<Profile />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="listings" element={<MyListings />} />
                  <Route path="orders" element={<IncomingOrders />} />
                  <Route path="purchases" element={<PurchaseHistory />} />
                  <Route path="orders/:id" element={<UserOrderDetail />} />
                </Route>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="users/:id" element={<UserDetail />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="listings/:id" element={<ListingDetail />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderDetail />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransitionWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
