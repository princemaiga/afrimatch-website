"use client";
import * as React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

function Toast({ message, type = "info", onClose }: ToastProps) {
  const bgClass = type === "success" ? "bg-green-800 border-green-600" : type === "error" ? "bg-red-800 border-red-600" : "bg-slate-800 border-slate-600";
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 text-white shadow-lg ${bgClass}`}>
      <span className="text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">×</button>
      )}
    </div>
  );
}

export { Toast };
