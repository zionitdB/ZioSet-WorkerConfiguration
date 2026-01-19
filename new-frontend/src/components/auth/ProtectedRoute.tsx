import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("isAuthenticated",isAuthenticated);
    
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
