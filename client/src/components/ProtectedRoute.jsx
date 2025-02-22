import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute component checks if the user is authenticated
const ProtectedRoute = ({ isAuthenticated }) => {
  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route (via Outlet)
  return <Outlet />;
};

// Export ProtectedRoute to use it in other files
export default ProtectedRoute;
