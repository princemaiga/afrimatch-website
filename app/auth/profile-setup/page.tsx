"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const INTERESTS = [
  "Travel", "Music", "Sports", "Movies", "Reading", "Cooking",
  "Art", "Technology", "Fashion", "Fitness", "Gaming", "Photography",
  "Hiking", "Yoga", "Meditation", "Dancing", "Volunteering", "Entrepreneurship",
  "Business", "Finance", "Health", "Education", "Culture", "Community",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function ProfileSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultMode = (searchParams?.get("mode") as "community" | "professional") || "community";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "",
    lookingFor: "",
    location: "",
    bio: "",
    interests: [] as string[],
    photos: [] as string[],
    mode: defaultMode,
    // Professional fields
    jobTitle: "",
    company: "",
    industry: "",
    skills: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...photoUrls].slice(0, 5),
      }));
    }
  };

  const getDOBString = () => {
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) return "";
    const monthIndex = MONTHS.indexOf(formData.dobMonth) + 1;
    return `${formData.dobYear}-${String(monthIndex).padStart(2, "0")}-${String(formData.dobDay).padStart(2, "0")}`;
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) {
        setError("Please select your complete date of birth.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.gender) {
        setError("Please select your gender.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const dateOfBirth = getDOBString();
    if (!dateOfBirth) {
      setError("Please complete your date of birth.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dateOfBirth,
          // Map community mode to dating for DB compatibility
          mode: formData.mode === "community" ? "dating" : formData.mode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || data.error || "Failed to save profile. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/auth/profile-setup");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">{status === "loading" ? "Loading..." : "Redirecting to login..."}</p>
        </div>
      </div>
    );
  }

  const totalSteps = formData.mode === "professional" ? 4 : 4;

  return (
    <div className="min-h-screen bg-[#0a0f1e] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{formData.mode === "professional" ? "💼" : "🌍"}</div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-400 mb-1">
            {formData.mode === "professional" ? "Professional Network" : "Community"} — Step {step} of {totalSteps}
          </p>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white mb-2">Basic Information</h2>

              {/* Mode selector */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">I am joining as</label>
                <div className="flex gap-3">
                  {[
                    { value: "community", label: "🌍 Community Member", desc: "Free forever" },
                    { value: "professional", label: "💼 Professional", desc: "Career & networking" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, mode: opt.value as "community" | "professional" }))}
                      className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                        formData.mode === opt.value
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-white/10 bg-white/3 hover:border-white/20"
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    autoComplete="given-name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>
              </div>

              {/* Date of Birth — 3 dropdowns */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth *</label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    name="dobDay"
                    value={formData.dobDay}
                    onChange={handleInputChange}
                    className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition"
                  >
                    <option value="">Day</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    name="dobMonth"
                    value={formData.dobMonth}
                    onChange={handleInputChange}
                    className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    name="dobYear"
                    value={formData.dobYear}
                    onChange={handleInputChange}
                    className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition"
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">You must be 18 or older to join AfriMatch.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country (e.g. Lagos, Nigeria)"
                  autoComplete="address-level2"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>
            </div>
          )}

          {/* Step 2: Gender & Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white mb-2">About You</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Gender *</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gender: g.toLowerCase() }))}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.gender === g.toLowerCase()
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-white/10 bg-white/3 text-slate-300 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {formData.mode === "community" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Interested in connecting with</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Men", "Women", "Everyone"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, lookingFor: opt.toLowerCase() === "men" ? "male" : opt.toLowerCase() === "women" ? "female" : "both" }))}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                          (formData.lookingFor === "male" && opt === "Men") ||
                          (formData.lookingFor === "female" && opt === "Women") ||
                          (formData.lookingFor === "both" && opt === "Everyone")
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-white/10 bg-white/3 text-slate-300 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.mode === "professional" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer, Nurse, Teacher"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company / Organisation</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Google, Self-employed"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500 focus:outline-none transition"
                    >
                      <option value="">Select industry</option>
                      {["Technology", "Healthcare", "Finance", "Education", "Agriculture", "Energy", "Media", "Government", "NGO / Non-profit", "Retail", "Manufacturing", "Construction", "Transport", "Tourism", "Other"].map((ind) => (
                        <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Bio & Interests */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white mb-2">Your Story</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={formData.mode === "professional"
                    ? "Tell us about your professional background and goals..."
                    : "Tell the community about yourself, your culture, and what you're passionate about..."}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition resize-none"
                />
                <p className="text-xs text-slate-500 mt-1 text-right">{formData.bio.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Interests <span className="text-slate-500 font-normal">(select up to 8)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        if (!formData.interests.includes(interest) && formData.interests.length >= 8) return;
                        toggleInterest(interest);
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                          : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                      } ${!formData.interests.includes(interest) && formData.interests.length >= 8 ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && (
                  <p className="text-xs text-amber-400 mt-2">{formData.interests.length} selected</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Photo */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white mb-2">Profile Photo</h2>
              <p className="text-slate-400 text-sm">Add a photo so people know who they're connecting with. You can always update this later.</p>

              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-amber-500/40 transition-all">
                <div className="text-4xl mb-3">📷</div>
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all inline-block">
                    Choose Photo
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-xs mt-3">JPG, PNG or GIF · Max 5 photos · 10MB each</p>
              </div>

              {formData.photos.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-3">{formData.photos.length} photo(s) selected</p>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-28 object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500 transition"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-amber-500 rounded text-white text-xs font-medium">Main</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-sm">
                  <span className="font-semibold">💡 Tip:</span> Profiles with a clear face photo get 3× more connections. You can skip this step and add photos later from your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition"
              >
                ← Back
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/20"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : "Complete Profile →"}
              </button>
            )}
          </div>

          {step === 4 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-3 py-2 text-slate-500 hover:text-slate-300 text-sm transition"
            >
              Skip for now — I'll add photos later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
