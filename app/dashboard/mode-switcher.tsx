"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface ModeSwitcherProps {
  currentMode: "community" | "professional" | "both";
  onModeChange: (mode: "community" | "professional") => void;
}

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const { data: session } = useSession();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCommunityProfile, setShowCommunityProfile] = useState(
    currentMode === "community" || currentMode === "both"
  );
  const [showProfessionalProfile, setShowProfessionalProfile] = useState(
    currentMode === "professional" || currentMode === "both"
  );

  const handleModeSwitch = async (newMode: "community" | "professional") => {
    setIsAnimating(true);

    try {
      const response = await fetch("/api/user/mode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });

      if (response.ok) {
        onModeChange(newMode);
        if (newMode === "community") {
          setShowCommunityProfile(true);
          setShowProfessionalProfile(false);
        } else {
          setShowCommunityProfile(false);
          setShowProfessionalProfile(true);
        }
      }
    } catch (error) {
      console.error("Failed to switch mode:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Switch Mode</h2>
          <p className="text-slate-400 text-sm">
            {currentMode === "community" && "Community Mode Active"}
            {currentMode === "professional" && "Professional Mode Active"}
            {currentMode === "both" && "You have access to both modes"}
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex gap-3">
          {(currentMode === "community" || currentMode === "both") && (
            <button
              onClick={() => handleModeSwitch("community")}
              disabled={isAnimating}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showCommunityProfile
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              } disabled:opacity-50`}
            >
              <span className="mr-2">🌍</span>
              Community
            </button>
          )}

          {(currentMode === "professional" || currentMode === "both") && (
            <button
              onClick={() => handleModeSwitch("professional")}
              disabled={isAnimating}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                showProfessionalProfile
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              } disabled:opacity-50`}
            >
              <span className="mr-2">💼</span>
              Professional
            </button>
          )}
        </div>
      </div>

      {/* Mode Info Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {(currentMode === "community" || currentMode === "both") && (
          <div
            className={`p-4 rounded-lg border-2 transition-all ${
              showCommunityProfile
                ? "border-amber-500 bg-amber-500/10"
                : "border-slate-700 bg-slate-800/50"
            }`}
          >
            <h3 className="font-semibold text-white mb-2">🌍 Community Profile</h3>
            <p className="text-sm text-slate-400">
              Discover community members and build meaningful connections across Africa
            </p>
            <div className="mt-3 text-xs text-slate-500">
              ✓ Community discovery • ✓ Messaging • ✓ Video calls
            </div>
          </div>
        )}

        {(currentMode === "professional" || currentMode === "both") && (
          <div
            className={`p-4 rounded-lg border-2 transition-all ${
              showProfessionalProfile
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-800/50"
            }`}
          >
            <h3 className="font-semibold text-white mb-2">💼 Professional Profile</h3>
            <p className="text-sm text-slate-400">
              Network, find jobs, and grow your career with industry professionals
            </p>
            <div className="mt-3 text-xs text-slate-500">
              ✓ Job listings • ✓ Networking • ✓ Mentorship
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
