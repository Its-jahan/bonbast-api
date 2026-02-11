import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-14 w-full min-w-0 rounded-2xl border-2 border-[#2a2a2a] bg-[#1a1a1a] px-5 py-3 text-base text-white transition-all placeholder:text-gray-500 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-[#0a0a0a]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
