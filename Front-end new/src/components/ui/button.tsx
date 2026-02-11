import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
  {
    variants: {
      variant: {
        default: "bg-[#2383e2] text-white hover:bg-[#1a6ec7] shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-[#e9e9e7] bg-white text-[#37352f] hover:bg-[#f7f6f3] hover:border-[#d3d3d1]",
        secondary:
          "bg-[#f7f6f3] text-[#37352f] hover:bg-[#e9e9e7]",
        ghost:
          "hover:bg-[#f7f6f3] hover:text-[#37352f]",
        link: "text-[#2383e2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-5",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
