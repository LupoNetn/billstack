'use client';

import Sidebar from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '72px' : '240px' }}
      >
        <DashboardTopBar />
        <main className="p-8 max-w-[1280px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
