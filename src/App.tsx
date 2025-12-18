import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import EmergencyDetail from "./pages/EmergencyDetail";
import ChangeRequest from "./pages/ChangeRequest";
import ChangeRequestDetail from "./pages/ChangeRequestDetail";
import ChangeResults from "./pages/ChangeResults";
import ChangeResultsDetail from "./pages/ChangeResultsDetail";
import ChangeSchedule from "./pages/ChangeSchedule";
import ChangeScheduleDetail from "./pages/ChangeScheduleDetail";
import PatchJob from "./pages/PatchJob";
import PatchJobs from "./pages/PatchJobs";
import PatchJobDetail from "./pages/PatchJobDetail";
import PatchPlan from "./pages/PatchPlan";
import PatchExecute from "./pages/PatchExecute";
import PatchFinish from "./pages/PatchFinish";
import PatchResults from "./pages/PatchResults";
import PatchResultsDetail from "./pages/PatchResultsDetail";
import PatchSchedule from "./pages/PatchSchedule";
import PatchScheduleDetail from "./pages/PatchScheduleDetail";
import CMDB from "./pages/CMDB";
import CMDBDetail from "./pages/CMDBDetail";
import CMDBHistory from "./pages/CMDBHistory";
import Approval from "./pages/Approval";
import ApprovalDetail from "./pages/ApprovalDetail";
import NotFound from "./pages/NotFound";
import { isAuthenticated, getUser } from "./lib/auth";

const queryClient = new QueryClient();

// Protected Route component that checks auth state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Check auth status on mount and when storage changes
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };

    // Listen for storage changes (e.g., login/logout in other tabs)
    window.addEventListener("storage", checkAuth);
    
    // Also check on focus to handle same-tab changes
    window.addEventListener("focus", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Login route that redirects if already authenticated
const LoginRoute = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="emergency/:id" element={<EmergencyDetail />} />
            <Route path="change-request" element={<ChangeRequest />} />
            <Route path="change-request/:id" element={<ChangeRequestDetail />} />
            <Route path="change-schedule" element={<ChangeSchedule />} />
            <Route path="change-schedule/:id" element={<ChangeScheduleDetail />} />
            <Route path="change-results" element={<ChangeResults />} />
            <Route path="change-results/:id" element={<ChangeResultsDetail />} />
            <Route path="patch-job" element={<PatchJob />} />
            <Route path="patch-jobs" element={<PatchJobs />} />
            <Route path="patch-job/:id" element={<PatchJobDetail />} />
            <Route path="patch-job/:id/detail" element={<PatchJobDetail />} />
            <Route path="patch-plan/:id" element={<PatchPlan />} />
            <Route path="patch-execute/:id" element={<PatchExecute />} />
            <Route path="patch-finish/:id" element={<PatchFinish />} />
            <Route path="patch-schedule" element={<PatchSchedule />} />
            <Route path="patch-schedule/:id" element={<PatchScheduleDetail />} />
            <Route path="patch-results" element={<PatchResults />} />
            <Route path="patch-results/:id" element={<PatchResultsDetail />} />
            <Route path="cmdb" element={<CMDB />} />
            <Route path="cmdb/:id" element={<CMDBDetail />} />
            <Route path="cmdb/:id/history" element={<CMDBHistory />} />
            <Route path="approval" element={<Approval />} />
            <Route path="approval/:id" element={<ApprovalDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
