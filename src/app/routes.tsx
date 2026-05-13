import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import PearlFarms from "./pages/PearlFarms";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import VerifyOTP from "./pages/auth/VerifyOTP";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LoginAnalytics from "./pages/admin/LoginAnalytics";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "pearl-farms", Component: PearlFarms },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/auth/verify-otp",
    Component: VerifyOTP,
  },
  {
    path: "/admin",
    children: [
      { index: true, Component: AdminLogin },
      { path: "dashboard", Component: AdminDashboard },
      { path: "analytics", Component: LoginAnalytics },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
