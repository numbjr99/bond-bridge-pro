import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";

import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ClientList from "@/pages/clients/ClientList";
import ClientDetail from "@/pages/clients/ClientDetail";
import ClientForm from "@/pages/clients/ClientForm";
import QuotationList from "@/pages/quotations/QuotationList";
import QuotationDetail from "@/pages/quotations/QuotationDetail";
import NewQuotation from "@/pages/quotations/NewQuotation";
import PolicyList from "@/pages/policies/PolicyList";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import SettingsPage from "@/pages/settings/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/quotations" element={<QuotationList />} />
              <Route path="/quotations/new" element={<NewQuotation />} />
              <Route path="/quotations/:id" element={<QuotationDetail />} />
              <Route path="/policies" element={<PolicyList />} />
              <Route path="/policies/:id" element={<PolicyDetail />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/credentials" element={<Navigate to="/settings" replace />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
