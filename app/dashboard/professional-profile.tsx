"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface ProfessionalProfileData {
  headline: string;
  bio: string;
  profilePhoto: string;
  coverPhoto: string;
  skills: string[];
  certifications: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  location: string;
  industry: string;
  jobTitle: string;
  company: string;
  yearsOfExperience: number;
  availability: string;
  openToWork: boolean;
  openToMentoring: boolean;
}

export function ProfessionalProfileEditor() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfessionalProfileData>({
    headline: "",
    bio: "",
    profilePhoto: "",
    coverPhoto: "",
    skills: [],
    certifications: [],
    experience: [],
    education: [],
    location: "",
    industry: "",
    jobTitle: "",
    company: "",
    yearsOfExperience: 0,
    availability: "available",
    openToWork: true,
    openToMentoring: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const array = value.split(",").map((item) => item.trim());
    setProfile((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    photoType: "profilePhoto" | "coverPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setProfile((prev) => ({
          ...prev,
          [photoType]: data.url,
        }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", year: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile/professional", {
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
      <h2 className="text-3xl font-bold text-white mb-8">💼 Professional Profile</h2>

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

      {/* Cover Photo */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Cover Photo</label>
        <div className="relative h-40 bg-slate-800 rounded-lg overflow-hidden mb-4">
          {profile.coverPhoto ? (
            <Image
              src={profile.coverPhoto}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No cover photo
            </div>
          )}
        </div>
        <button
          onClick={() => coverPhotoRef.current?.click()}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all"
        >
          Upload Cover Photo
        </button>
        <input
          ref={coverPhotoRef}
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e, "coverPhoto")}
          className="hidden"
        />
      </div>

      {/* Profile Photo */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-slate-800 rounded-full overflow-hidden">
            {profile.profilePhoto ? (
              <Image
                src={profile.profilePhoto}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                📷
              </div>
            )}
          </div>
          <button
            onClick={() => profilePhotoRef.current?.click()}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all"
          >
            Upload Photo
          </button>
        </div>
        <input
          ref={profilePhotoRef}
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoUpload(e, "profilePhoto")}
          className="hidden"
        />
      </div>

      {/* Headline */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Headline</label>
        <input
          type="text"
          name="headline"
          value={profile.headline}
          onChange={handleInputChange}
          placeholder="e.g., Senior Software Engineer at Tech Company"
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Bio */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">About</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleInputChange}
          placeholder="Tell professionals about yourself..."
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          rows={4}
        />
      </div>

      {/* Current Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-2">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleInputChange}
            placeholder="e.g., Senior Engineer"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Company</label>
          <input
            type="text"
            name="company"
            value={profile.company}
            onChange={handleInputChange}
            placeholder="e.g., Tech Company"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Industry</label>
          <input
            type="text"
            name="industry"
            value={profile.industry}
            onChange={handleInputChange}
            placeholder="e.g., Technology"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Years of Experience</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Skills</label>
        <input
          type="text"
          placeholder="React, Node.js, Python, etc. (comma-separated)"
          value={profile.skills.join(", ")}
          onChange={(e) => handleArrayInputChange("skills", e.target.value)}
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Certifications */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-2">Certifications</label>
        <input
          type="text"
          placeholder="AWS Certified, Google Cloud, etc. (comma-separated)"
          value={profile.certifications.join(", ")}
          onChange={(e) => handleArrayInputChange("certifications", e.target.value)}
          className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Experience */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Experience</h3>
          <button
            onClick={addExperience}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            + Add Experience
          </button>
        </div>

        {profile.experience.map((exp, index) => (
          <div key={index} className="bg-slate-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => updateExperience(index, "title", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Duration (e.g., Jan 2020 - Present)"
              value={exp.duration}
              onChange={(e) => updateExperience(index, "duration", e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
            />

            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => updateExperience(index, "description", e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
              rows={3}
            />

            <button
              onClick={() => removeExperience(index)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Education</h3>
          <button
            onClick={addEducation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            + Add Education
          </button>
        </div>

        {profile.education.map((edu, index) => (
          <div key={index} className="bg-slate-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="School/University"
                value={edu.school}
                onChange={(e) => updateEducation(index, "school", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(index, "field", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Graduation Year"
                value={edu.year}
                onChange={(e) => updateEducation(index, "year", e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              onClick={() => removeEducation(index)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleInputChange}
            placeholder="City, Country"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Availability</label>
          <select
            name="availability"
            value={profile.availability}
            onChange={handleInputChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="not-available">Not Available</option>
            <option value="open-to-offers">Open to Offers</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6 mb-8">
        <label className="flex items-center gap-2 text-white cursor-pointer">
          <input
            type="checkbox"
            name="openToWork"
            checked={profile.openToWork}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          Open to Work
        </label>

        <label className="flex items-center gap-2 text-white cursor-pointer">
          <input
            type="checkbox"
            name="openToMentoring"
            checked={profile.openToMentoring}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          Open to Mentoring
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
