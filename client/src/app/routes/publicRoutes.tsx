import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * PublicRoute — accessible only when NOT authenticated.
 * Redirects authenticated users to the game dashboard.
 */
const PublicRoute = () => {
    const { isAuthenticated, isInitializing } = useSelector((state: RootState) => state.auth);

    if (isInitializing) return null; // wait for initial auth check

    if (isAuthenticated) {
        return <Navigate to="/arcade" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
