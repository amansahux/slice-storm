import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * ProtectedRoute — accessible only when authenticated.
 * Redirects unauthenticated users to login with the target destination preserved.
 */
const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useSelector(
    (state: RootState) => state.auth
  );

  if (isInitializing) return null; // wait for initial auth check

  if (!isAuthenticated) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?from=${from}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
