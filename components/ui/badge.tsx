import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

const variantClasses: Record<string, string> = {
  default: "bg-amber-500 text-white",
  secondary: "bg-slate-700 text-slate-300",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-600 text-slate-300",
  success: "bg-green-600 text-white",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}

export { Badge };
