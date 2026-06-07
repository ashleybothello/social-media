import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import InstagramConnect from "./pages/InstagramConnect";
import InstagramCallback from "./pages/InstagramCallback";
import InstagramAnalytics from "./pages/InstagramAnalytics";
import AIInsights from "./pages/insights/AIInsights";
import ContentStudio from "./pages/content-studio/ContentStudio";
import ProfileOptimizer from "./pages/profile-optimizer/ProfileOptimizer";
import AIAudit from "./pages/ai-audit/AIAudit";
import Competitors from "./pages/Competitors";
import CalendarView from "./pages/CalendarView";
import TrendDiscovery from "./pages/trends/TrendDiscovery";
import AICoach from "./pages/ai-coach/AICoach";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Instagram OAuth callback (public — Meta redirects here) */}
        <Route path="/instagram/callback" element={<InstagramCallback />} />

        {/* Protected — wrapped in DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/instagram/connect"  element={<InstagramConnect />} />
            <Route path="/instagram"          element={<InstagramAnalytics />} />
            <Route path="/insights"           element={<AIInsights />} />
            <Route path="/content-studio"     element={<ContentStudio />} />
            <Route path="/profile-optimizer"  element={<ProfileOptimizer />} />
            <Route path="/ai-audit"           element={<AIAudit />} />
            <Route path="/competitors"        element={<Competitors />} />
            <Route path="/calendar"           element={<CalendarView />} />
            <Route path="/trends"             element={<TrendDiscovery />} />
            <Route path="/ai-coach"           element={<AICoach />} />
          </Route>
        </Route>

        {/* Redirects for old routes */}
        <Route path="/calendar/:id" element={<Navigate to="/calendar" replace />} />
        <Route path="/performance"  element={<Navigate to="/dashboard" replace />} />
        <Route path="/brand-voice"  element={<Navigate to="/content-studio" replace />} />
        <Route path="/content-strategy" element={<Navigate to="/ai-audit" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
