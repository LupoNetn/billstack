import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amount: number): string {
  return `₦${(amount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatBillingCycle(intervalUnit: string, intervalCount: number): string {
  if (intervalCount === 1) {
    switch (intervalUnit) {
      case 'day': return 'Daily'
      case 'week': return 'Weekly'
      case 'month': return 'Monthly'
      case 'year': return 'Annual'
      default: return intervalUnit
    }
  }
  
  const plural = intervalCount > 1 ? 's' : ''
  switch (intervalUnit) {
    case 'day': return `Every ${intervalCount} day${plural}`
    case 'week': return `Every ${intervalCount} week${plural}`
    case 'month': return `Every ${intervalCount} month${plural}`
    case 'year': return `Every ${intervalCount} year${plural}`
    default: return `${intervalCount} ${intervalUnit}${plural}`
  }
}
