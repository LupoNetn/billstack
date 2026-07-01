'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  RefreshCcw,
  Wallet,
  BarChart2,
  Code2,
  Settings,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  CreditCard as PaymentIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';
import { useLogout } from '@/lib/auth/hooks';
import { useSidebar } from './SidebarContext';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: RefreshCcw },
  { href: '/dashboard/plans', label: 'Plans', icon: CreditCard },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/payments', label: 'Payments', icon: PaymentIcon },
  { href: '/dashboard/dva', label: 'DVA Accounts', icon: Wallet },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/developers', label: 'Developers', icon: Code2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLogout();
  const { isCollapsed, toggleCollapse } = useSidebar();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#F5F3FF] border-r border-[#E5E7EB] flex flex-col z-40 transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Wordmark */}
      <div className="h-16 flex items-center px-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#5B21B6] flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[17px] text-[#5B21B6] tracking-tight">Billstack</span>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute right-0 top-20 -translate-y-1/2 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[#6B7280]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#6B7280]" />
        )}
      </button>

      {/* Merchant Business Name */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-b border-[#E5E7EB]">
          <p className="text-[13px] font-semibold text-[#111827]">
            {user?.personal_name || 'My Business'}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative',
                isActive
                  ? 'sidebar-item-active'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#EDE9FE]',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? label : undefined}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#5B21B6]' : '')} />
              {!isCollapsed && (
                <span className={cn('font-medium', isActive ? 'text-[#5B21B6]' : '')}>{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Merchant Account */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
            'text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
