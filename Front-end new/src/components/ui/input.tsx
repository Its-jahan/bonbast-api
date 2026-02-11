import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-[#e9e9e7] bg-white px-4 py-2 text-sm text-[#37352f] transition-all placeholder:text-[#9b9a97] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-[#2383e2] focus:ring-2 focus:ring-[#2383e2]/20 focus:shadow-sm",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
