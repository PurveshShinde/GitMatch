import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./components/OnBoarding";
import GitHubCallback from "./pages/GitHubCallback";
import SkillTest from "./pages/SkillTest";
import GithubAuthRequired from "./components/common/GithubAuthRequired";

// Error and Layout Infrastructure
import ErrorBoundary from "./components/common/ErrorBoundary";
import DashboardLayout from "./features/dashboard/DashboardLayout";

// Lazy-loaded Pages
const OverviewPage = lazy(() => import("./features/dashboard/pages/OverviewPage"));
const IssuesPage = lazy(() => import("./features/dashboard/pages/IssuesPage"));
const RepositoriesPage = lazy(() => import("./features/dashboard/pages/RepositoriesPage"));
const NetworkPage = lazy(() => import("./features/dashboard/pages/NetworkPage"));
const MessagesPage = lazy(() => import("./features/dashboard/pages/MessagesPage"));
const CommunityPage = lazy(() => import("./features/dashboard/pages/CommunityPage"));

// Protected Route - requires authentication
function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.auth);
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

// Onboarding Guard - redirects to onboarding if not completed
function OnboardedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.auth);
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  if (!currentUser.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

// Simple fallback for page loads
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-test"
          element={
            <ProtectedRoute>
              <SkillTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <OnboardedRoute>
              <Settings />
            </OnboardedRoute>
          }
        />

        {/* Dashboard Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <OnboardedRoute>
              <ErrorBoundary>
                <DashboardLayout />
              </ErrorBoundary>
            </OnboardedRoute>
          }
        >
          <Route index element={<Suspense fallback={<PageFallback />}><OverviewPage /></Suspense>} />
          <Route path="issues" element={<Suspense fallback={<PageFallback />}><IssuesPage /></Suspense>} />
          <Route path="repos" element={<Suspense fallback={<PageFallback />}><RepositoriesPage /></Suspense>} />
          <Route path="network" element={<Suspense fallback={<PageFallback />}><NetworkPage /></Suspense>} />
          <Route path="messages" element={<Suspense fallback={<PageFallback />}><MessagesPage /></Suspense>} />
          <Route path="community" element={<Suspense fallback={<PageFallback />}><GithubAuthRequired title="Community Locked"><CommunityPage /></GithubAuthRequired></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
