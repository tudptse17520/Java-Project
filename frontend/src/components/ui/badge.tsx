import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary border-primary/20",
        secondary:
          "bg-secondary/20 text-secondary-foreground border-secondary/20",
        destructive:
          "bg-destructive/15 text-destructive border-destructive/20",
        outline:
          "border-border text-foreground bg-transparent",
        success:
          "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
        warning:
          "bg-amber-500/15 text-amber-500 border-amber-500/20",
        info:
          "bg-blue-500/15 text-blue-500 border-blue-500/20",
        purple:
          "bg-purple-500/15 text-purple-500 border-purple-500/20",
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

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
