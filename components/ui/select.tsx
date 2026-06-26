"use client";
import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

function Select({ className, children, onValueChange, onChange, ...props }: SelectProps) {
  return (
    <select
      className={`flex h-9 w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-1 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      {...props}
    >
      {children}
    </select>
  );
}

function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-slate-400">{placeholder}</span>;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children as string}</option>;
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
