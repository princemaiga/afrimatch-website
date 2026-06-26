export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Sample profiles for demonstration (replace with database in production)
const SAMPLE_PROFILES = [
  {
    id: "profile-1",
    name: "Amara Osei",
    age: 26,
    location: "Accra, Ghana",
    bio: "Passionate about African art and culture. Looking for genuine connections.",
    interests: ["Art", "Travel", "Music", "Cooking"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "dating",
    matchScore: 92,
  },
  {
    id: "profile-2",
    name: "Kwame Mensah",
    age: 29,
    location: "Lagos, Nigeria",
    bio: "Tech entrepreneur building solutions for Africa. Into hiking and photography.",
    interests: ["Technology", "Hiking", "Photography", "Entrepreneurship"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "both",
    matchScore: 88,
  },
  {
    id: "profile-3",
    name: "Fatima Al-Rashid",
    age: 24,
    location: "Cairo, Egypt",
    bio: "Medical student with a love for travel and discovering new cuisines.",
    interests: ["Travel", "Cooking", "Reading", "Fitness"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "dating",
    matchScore: 85,
  },
  {
    id: "profile-4",
    name: "Chidi Okonkwo",
    age: 31,
    location: "Nairobi, Kenya",
    bio: "Finance professional who loves football and jazz music.",
    interests: ["Sports", "Music", "Finance", "Travel"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "both",
    matchScore: 82,
  },
  {
    id: "profile-5",
    name: "Zara Diallo",
    age: 27,
    location: "Dakar, Senegal",
    bio: "Fashion designer inspired by African textiles and patterns.",
    interests: ["Fashion", "Art", "Dancing", "Yoga"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "dating",
    matchScore: 79,
  },
  {
    id: "profile-6",
    name: "Emmanuel Asante",
    age: 33,
    location: "Johannesburg, South Africa",
    bio: "Software engineer building fintech solutions. Passionate about financial inclusion.",
    interests: ["Technology", "Gaming", "Fitness", "Entrepreneurship"],
    photos: ["/images/placeholder-profile.jpg"],
    verified: true,
    mode: "both",
    matchScore: 76,
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "community";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Filter by mode
    const filtered = SAMPLE_PROFILES.filter(
      (p) => p.mode === mode || p.mode === "both"
    );

    // Paginate
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      profiles: paginated,
      total: filtered.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Matches error:", error);
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, action } = await request.json();

    if (!targetUserId || !["like", "pass", "superlike"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // In production, save to database and check for mutual connections
    const isMatch = action === "like" && Math.random() > 0.6; // 40% connection rate for demo

    return NextResponse.json({
      success: true,
      action,
      isMatch,
      message: isMatch ? "Connection created! 🎉" : action === "like" ? "Interest sent!" : "Passed",
    });
  } catch (error) {
    console.error("Match action error:", error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
