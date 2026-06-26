"use client";
import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({ open: false, setOpen: () => {} });

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen, open } = React.useContext(DropdownMenuContext);
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer">
      {children}
    </div>
  );
}

function DropdownMenuContent({ className, children, align = "start" }: { className?: string; children: React.ReactNode; align?: "start" | "end" | "center" }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  if (!open) return null;
  const alignClass = align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className={`absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-slate-700 bg-slate-800 p-1 shadow-md ${alignClass} ${className ?? ""}`}>
        {children}
      </div>
    </>
  );
}

function DropdownMenuItem({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  const { setOpen } = React.useContext(DropdownMenuContext);
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-300 outline-none transition-colors hover:bg-slate-700 hover:text-white ${className ?? ""}`}
      onClick={() => { onClick?.(); setOpen(false); }}
    >
      {children}
    </div>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={`-mx-1 my-1 h-px bg-slate-700 ${className ?? ""}`} />;
}

function DropdownMenuLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`px-2 py-1.5 text-xs font-semibold text-slate-400 ${className ?? ""}`}>{children}</div>;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };
