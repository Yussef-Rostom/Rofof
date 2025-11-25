import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/userSlice";
import { AppDispatch, RootState } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Listings from "./pages/admin/Listings";
import ListingDetail from "./pages/admin/ListingDetail";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import MyListings from "./pages/account/MyListings";
import IncomingOrders from "@/pages/account/IncomingOrders";
import PurchaseHistory from "./pages/account/PurchaseHistory";
import UserOrderDetail from "./pages/account/UserOrderDetail";
import NotFound from "./pages/NotFound";
import { fetchCart } from "./store/cartSlice";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "./components/MainLayout";

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
    if (!userLoading && isAuthCheckComplete && isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, userLoading, isAuthCheckComplete, isAuthenticated]);

  if (!isAuthCheckComplete) {
    return <Spinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route element={<MainLayout />}>
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
              </Route>
            </Route>

            {/* Protected Routes without Navbar */}
            <Route element={<ProtectedRoute />}>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
