import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ChangeManagement from "./pages/ChangeManagement";
import ChangeManagementDetail from "./pages/ChangeManagementDetail";
import ChangeManagementCalendar from "./pages/ChangeManagementCalendar";
import ChangeManagementForm from "./pages/ChangeManagementForm";
import CMDB from "./pages/CMDB";
import CMDBCategory from "./pages/CMDBCategory";
import CMDBDetail from "./pages/CMDBDetail";
import CMDBHistory from "./pages/CMDBHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/change-management" element={<ChangeManagement />} />
            <Route path="/change-management/detail/:id" element={<ChangeManagementDetail />} />
            <Route path="/change-management/form/:id" element={<ChangeManagementForm />} />
            <Route path="/change-management/calendar" element={<ChangeManagementCalendar />} />
            <Route path="/cmdb" element={<CMDB />} />
            <Route path="/cmdb/:category" element={<CMDBCategory />} />
            <Route path="/cmdb/detail/:id" element={<CMDBDetail />} />
            <Route path="/cmdb/history/:id" element={<CMDBHistory />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
