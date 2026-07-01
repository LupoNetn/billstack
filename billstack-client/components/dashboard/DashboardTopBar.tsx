'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';

export default function DashboardTopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [environment, setEnvironment] = useState<'live' | 'test'>('live');

  useEffect(() => {
    const stored = localStorage.getItem('billstack_environment') as 'live' | 'test' | null;
    if (stored) {
      setEnvironment(stored);
    }
  }, []);

  const toggleEnvironment = () => {
    const newEnv = environment === 'live' ? 'test' : 'live';
    setEnvironment(newEnv);
    localStorage.setItem('billstack_environment', newEnv);
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname.startsWith('/dashboard/subscriptions')) return 'Subscriptions';
    if (pathname.startsWith('/dashboard/plans')) return 'Plans';
    if (pathname.startsWith('/dashboard/customers')) return 'Customers';
    if (pathname.startsWith('/dashboard/invoices')) return 'Invoices';
    if (pathname.startsWith('/dashboard/payments')) return 'Payments';
    if (pathname.startsWith('/dashboard/dva')) return 'DVA Accounts';
    if (pathname.startsWith('/dashboard/analytics')) return 'Analytics';
    if (pathname.startsWith('/dashboard/developers')) return 'Developers';
    if (pathname.startsWith('/dashboard/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Page Title */}
      <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">
        {getPageTitle()}
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Environment Toggle */}
        <button
          onClick={toggleEnvironment}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            environment === 'live'
              ? 'bg-[#ECFDF5] text-[#059669]'
              : 'bg-[#FFFBEB] text-[#D97706]'
          )}
        >
          {environment === 'live' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {environment === 'live' ? 'Live' : 'Test'}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F5F3FF] rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#5B21B6] flex items-center justify-center text-white text-sm font-semibold">
          {user?.personal_name?.charAt(0).toUpperCase() || 'M'}
        </div>
      </div>
    </header>
  );
}
