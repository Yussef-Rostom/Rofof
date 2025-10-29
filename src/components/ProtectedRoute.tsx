import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "@/store";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  // Optionally, you can add roles here if you want to protect routes based on user roles
  // roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.user);

  if (loading) {
    // Optionally, render a loading spinner or a blank page while authentication status is being checked
    return <div>Loading authentication...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
