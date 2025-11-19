import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-gray-100 text-gray-900 border-transparent": variant === "default",
          "border-gray-300 text-gray-700 bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
