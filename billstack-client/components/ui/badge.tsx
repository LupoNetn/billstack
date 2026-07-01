import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white hover:bg-primary/80",
        secondary:
          "border-transparent bg-elevated text-foreground hover:bg-elevated/80",
        destructive:
          "border-transparent bg-danger/15 text-danger hover:bg-danger/25",
        outline: "text-foreground border border-border",
        active: "border-transparent bg-success/15 text-success hover:bg-success/25",
        trialing: "border-transparent bg-primary/15 text-primary hover:bg-primary/25",
        paused: "border-transparent bg-warning/15 text-warning hover:bg-warning/25",
        cancelled: "border-transparent bg-muted/15 text-muted hover:bg-muted/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
