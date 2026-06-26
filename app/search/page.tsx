"use client";
import { Navbar } from "@/components/navbar";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "user" | "job" | "course" | "article";
  metadata: Record<string, any>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedType, setSelectedType] = useState<"all" | "users" | "jobs" | "courses" | "articles">("all");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [industry, setIndustry] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      performSearch();
    }
  }, [query, selectedType, location, skills, industry, minSalary, maxSalary]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        type: selectedType,
        ...(location && { location }),
        ...(skills && { skills }),
        ...(industry && { industry }),
        ...(minSalary && { minSalary }),
        ...(maxSalary && { maxSalary }),
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      // Format results
      const formattedResults: SearchResult[] = [
        ...data.users.map((u: any) => ({ ...u, type: "user" })),
        ...data.jobs.map((j: any) => ({ ...j, type: "job" })),
        ...data.courses.map((c: any) => ({ ...c, type: "course" })),
        ...data.articles.map((a: any) => ({ ...a, type: "article" })),
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((r) => {
    if (selectedType === "all") return true;
    return r.type === selectedType.slice(0, -1); // Remove 's' from plural
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Search</h1>
          <p className="text-purple-100">Find people, jobs, courses, and articles</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-6">Filters</h2>

              {/* Search Query */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">Type</label>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Results" },
                    { id: "users", label: "People" },
                    { id: "jobs", label: "Jobs" },
                    { id: "courses", label: "Courses" },
                    { id: "articles", label: "Articles" },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type.id}
                        checked={selectedType === type.id}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="ml-3 text-slate-300 hover:text-white">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              {(selectedType === "all" || selectedType === "users" || selectedType === "jobs") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Skills Filter */}
              {(selectedType === "all" || selectedType === "users" || selectedType === "jobs") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Python, etc."
                    className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Industry Filter */}
              {(selectedType === "all" || selectedType === "users" || selectedType === "jobs") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="">All Industries</option>
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Salary Range */}
              {(selectedType === "all" || selectedType === "jobs") && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Salary Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-slate-400">Searching...</p>
                </div>
              </div>
            ) : query.length < 3 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">Enter at least 3 characters to search</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No results found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results Count */}
                <div className="text-slate-400 mb-6">
                  Found {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                </div>

                {/* Results List */}
                {filteredResults.map((result) => (
                  <div key={result.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-750 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-purple-400 uppercase bg-purple-600/20 px-2 py-1 rounded">
                            {result.type}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {result.title || result.metadata.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">
                      {result.description || result.metadata.description || result.metadata.bio}
                    </p>

                    {/* Type-specific metadata */}
                    {result.type === "user" && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.metadata.skills?.map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {result.type === "job" && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Salary</p>
                          <p className="text-white font-semibold">{result.metadata.salary}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Type</p>
                          <p className="text-white font-semibold">{result.metadata.jobType}</p>
                        </div>
                      </div>
                    )}

                    {result.type === "course" && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Rating</p>
                          <p className="text-white font-semibold">★ {result.metadata.rating}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Price</p>
                          <p className="text-white font-semibold">{result.metadata.price}</p>
                        </div>
                      </div>
                    )}

                    {result.type === "article" && (
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>👁️ {result.metadata.views} views</span>
                        <span>👏 {result.metadata.likes} engagements</span>
                        <span>{result.metadata.readTime} min read</span>
                      </div>
                    )}

                    <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
