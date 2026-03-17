import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import AppSidebar from "./AppSidebar";
import CommandBar from "./CommandBar";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar onOpenCommandBar={() => setCommandBarOpen(true)} />
      <main className="flex-1 overflow-y-auto">
        <div className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <CommandBar open={commandBarOpen} onOpenChange={setCommandBarOpen} />
    </div>
  );
}
