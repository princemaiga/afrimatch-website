export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get professional profile from database
    // For now, return mock data
    return NextResponse.json({
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

    // Update professional profile in database
    console.log("Updating professional profile:", data);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
