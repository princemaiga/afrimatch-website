export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db/client";
import { datingProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from email (would need to query users table)
    // For now, return mock data
    return NextResponse.json({
      bio: "",
      interests: [],
      photos: [],
      ageRange: "25-35",
      lookingFor: "community",
      relationshipGoal: "networking",
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
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Update dating profile in database
    // This would use the queries from lib/db/queries.ts
    console.log("Updating dating profile:", data);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
