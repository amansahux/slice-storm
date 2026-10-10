import { createBrowserRouter } from "react-router";

// Layouts
import AuthLayout from "../layout/authLayout";
import GameLayout from "../layout/gameLayout";

// Route guards
import PublicRoute from "./publicRoutes";
import ProtectedRoute from "./protectedRoutes";

// Pages — lazy loaded for code splitting (Rule 08)
import { lazy } from "react";

const LandingPage = lazy(() => import("../../features/landing/ui/pages/LandingPage"));
const Login = lazy(() => import("../../features/auth/ui/pages/Login"));
const Register = lazy(() => import("../../features/auth/ui/pages/Register"));

// Future protected pages — add lazy imports here
// const Dashboard = lazy(() => import("../../features/dashboard/ui/pages/Dashboard"));

const router = createBrowserRouter([
    // ── Public routes (redirect to /dashboard if already logged in) ──
    {
        element: <PublicRoute />,
        children: [
            // Landing page — no layout wrapper
            {
                path: "/",
                element: <LandingPage />,
            },
            // Auth pages — wrapped in AuthLayout
            {
                element: <AuthLayout />,
                children: [
                    { path: "/login", element: <Login /> },
                    { path: "/register", element: <Register /> },
                ],
            },
        ],
    },

    // ── Protected routes (redirect to /login if not authenticated) ──
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <GameLayout />,
                children: [
                    // { path: "/dashboard", element: <Dashboard /> },
                    // Add more protected game routes here
                ],
            },
        ],
    },
]);

export default router;
