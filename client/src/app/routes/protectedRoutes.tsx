import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * ProtectedRoute — accessible only when authenticated.
 * Redirects unauthenticated users to login.
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isInitializing } = useSelector((state: RootState) => state.auth);

    if (isInitializing) return null; // wait for initial auth check

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
