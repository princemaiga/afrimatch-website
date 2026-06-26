"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface DatingProfileData {
  bio: string;
  interests: string[];
  photos: string[];
  ageRange: string;
  lookingFor: string;
  connectionGoal: string;
  height: string;
  bodyType: string;
  education: string;
  occupation: string;
  income: string;
  smoking: string;
  drinking: string;
  religion: string;
  ethnicity: string;
  languages: string[];
}

export function DatingProfileEditor() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<DatingProfileData>({
    bio: "",
    interests: [],
    photos: [],
    ageRange: "25-35",
    lookingFor: "community",
    connectionGoal: "community-connection",
    height: "",
    bodyType: "",
    education: "",
    occupation: "",
    income: "",
    smoking: "no",
    drinking: "socially",
    religion: "",
    ethnicity: "",
    languages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const array = value.split(",").map((item) => item.trim());
    setProfile((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    const newPhotos = [...profile.photos];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          newPhotos.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setProfile((prev) => ({
      ...prev,
      photos: newPhotos,
    }));

    setLoading(false);
  };

  const removePhoto = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile/community", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setSuccess("Profile saved successfully!");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-lg p-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-white mb-8">🌍 Community Profile</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Photos Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {profile.photos.map((photo, index) => (
            <div key={index} className="relative group">
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}

          {profile.photos.length < 6 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-4 flex items-center justify-center hover:border-purple-500 transition-all"
            >
              <span className="text-4xl">+</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <p className="text-slate-400 text-sm">Upload up to 6 photos. First photo will be your main profile picture.</p>
      </div>

      {/* Bio Section */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Bio</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          rows={4}
        />
        <p className="text-slate-400 text-sm mt-2">{profile.bio.length}/500 characters</p>
      </div>

      {/* Interests Section */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Interests</label>
        <input
          type="text"
          placeholder="Travel, Music, Sports, etc. (comma-separated)"
          value={profile.interests.join(", ")}
          onChange={(e) => handleArrayInputChange("interests", e.target.value)}
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-2">Looking For</label>
          <select
            name="lookingFor"
            value={profile.lookingFor}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="everyone">Everyone</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Connection Goal</label>
          <select
            name="connectionGoal"
            value={profile.connectionGoal}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="networking">Networking</option>
            <option value="friendship">Friendship</option>
            <option value="community-collaboration">Community Collaboration</option>
            <option value="mentorship">Mentorship</option>
            <option value="professional-growth">Professional Growth</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Height</label>
          <input
            type="text"
            name="height"
            value={profile.height}
            onChange={handleInputChange}
            placeholder="e.g., 5ft 10in"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Body Type</label>
          <select
            name="bodyType"
            value={profile.bodyType}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="slim">Slim</option>
            <option value="athletic">Athletic</option>
            <option value="average">Average</option>
            <option value="curvy">Curvy</option>
            <option value="muscular">Muscular</option>
          </select>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-2">Smoking</label>
          <select
            name="smoking"
            value={profile.smoking}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="no">No</option>
            <option value="occasionally">Occasionally</option>
            <option value="regularly">Regularly</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Drinking</label>
          <select
            name="drinking"
            value={profile.drinking}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="no">No</option>
            <option value="socially">Socially</option>
            <option value="regularly">Regularly</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Religion</label>
          <input
            type="text"
            name="religion"
            value={profile.religion}
            onChange={handleInputChange}
            placeholder="e.g., Christian, Muslim, etc."
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Ethnicity</label>
          <input
            type="text"
            name="ethnicity"
            value={profile.ethnicity}
            onChange={handleInputChange}
            placeholder="e.g., African, European, etc."
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Professional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-2">Education</label>
          <input
            type="text"
            name="education"
            value={profile.education}
            onChange={handleInputChange}
            placeholder="e.g., Bachelor's in Engineering"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={profile.occupation}
            onChange={handleInputChange}
            placeholder="e.g., Software Engineer"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Income Range</label>
          <select
            name="income"
            value={profile.income}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="">Prefer not to say</option>
            <option value="0-30k">$0 - $30k</option>
            <option value="30k-60k">$30k - $60k</option>
            <option value="60k-100k">$60k - $100k</option>
            <option value="100k-150k">$100k - $150k</option>
            <option value="150k+">$150k+</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Languages</label>
          <input
            type="text"
            placeholder="English, French, Swahili (comma-separated)"
            value={profile.languages.join(", ")}
            onChange={(e) => handleArrayInputChange("languages", e.target.value)}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
