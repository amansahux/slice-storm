import { createBrowserRouter } from "react-router";

// Layouts
import AuthLayout from "../layout/authLayout";
import GameLayout from "../layout/gameLayout";

// Route guards
import PublicRoute from "./publicRoutes";
import ProtectedRoute from "./protectedRoutes";

// Pages — lazy loaded for code splitting (Rule 08)
import { lazy } from "react";

const LandingPage = lazy(
  () => import("../../features/landing/ui/pages/LandingPage")
);
const Login = lazy(() => import("../../features/auth/ui/pages/Login"));
const Register = lazy(() => import("../../features/auth/ui/pages/Register"));

// Protected game pages
const Dashboard = lazy(() => import("../../features/dashboard/ui/pages/Dashboard"));
const Leaderboard = lazy(() => import("../../features/leaderboard/ui/pages/Leaderboard"));
const History = lazy(() => import("../../features/history/ui/pages/History"));
const Setting = lazy(() => import("../../features/setting/ui/pages/Setting"));
const Profile = lazy(() => import("../../features/profile/ui/pages/Profile"));
import { Game } from "../../features/games/ui/pages/Game";

// Public policy & support pages (wrapped in GameLayout for consistent Navbar & Footer)
const TermsOfService = lazy(
  () => import("../../features/legal/ui/pages/TermsOfService")
);
const PrivacyPolicy = lazy(
  () => import("../../features/legal/ui/pages/PrivacyPolicy")
);
const ArcadeSafety = lazy(
  () => import("../../features/legal/ui/pages/ArcadeSafety")
);
const CustomerSupport = lazy(
  () => import("../../features/legal/ui/pages/CustomerSupport")
);

const router = createBrowserRouter([
  // ── Public routes ──
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

  // ── Public Legal & Information Pages (wrapped in GameLayout) ──
  {
    element: <GameLayout />,
    children: [
      { path: "/terms", element: <TermsOfService /> },
      { path: "/privacy", element: <PrivacyPolicy /> },
      { path: "/safety", element: <ArcadeSafety /> },
      { path: "/support", element: <CustomerSupport /> },
    ],
  },

  // ── Protected routes (redirect to /login if not authenticated) ──
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <GameLayout />,
        children: [
          { path: "/arcade", element: <Game /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/leaderboard", element: <Leaderboard /> },
          { path: "/history", element: <History /> },
          { path: "/setting", element: <Setting /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
]);

export default router;
