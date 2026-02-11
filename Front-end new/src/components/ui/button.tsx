import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
        outline:
          "border-2 border-[#2a2a2a] bg-[#1a1a1a] text-white hover:bg-[#262626] hover:border-[#3a3a3a]",
        secondary:
          "bg-[#262626] text-white hover:bg-[#2a2a2a]",
        ghost:
          "hover:bg-[#1a1a1a] hover:text-white text-gray-400",
        link: "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-3",
        sm: "h-11 rounded-xl gap-2 px-5",
        lg: "h-16 rounded-2xl px-10",
        icon: "size-14 rounded-2xl",
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
