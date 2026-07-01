import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export default function TopBar({ title, action, className }: TopBarProps) {
  return (
    <div className={cn('flex items-center justify-between mb-8', className)}>
      <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
