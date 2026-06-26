export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // If database is available, save to DB
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/lib/db/client");
        const { users, datingProfiles, professionalProfiles, userModes } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        if (session?.user?.email) {
          const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);

          if (user) {
            // Update user name if provided
            if (body.firstName || body.lastName) {
              await db
                .update(users)
                .set({
                  name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
                  updatedAt: new Date(),
                })
                .where(eq(users.id, user.id));
            }

            // Save mode preference
            if (body.mode) {
              const existingMode = await db
                .select({ id: userModes.id })
                .from(userModes)
                .where(eq(userModes.userId, user.id))
                .limit(1);

              if (existingMode.length === 0) {
                await db.insert(userModes).values({
                  userId: user.id,
                  mode: body.mode as "dating" | "professional" | "both",
                });
              }
            }

            // Save dating profile if mode includes dating
            if (body.mode === "dating" || body.mode === "both") {
              await db
                .insert(datingProfiles)
                .values({
                  userId: user.id,
                  bio: body.bio || "",
                  interests: body.interests || [],
                  photos: body.photos || [],
                  lookingFor: body.lookingFor || "community",
                  relationshipGoal: "networking",
                  ageRange: "25-35",
                })
                .onConflictDoUpdate({
                  target: datingProfiles.userId,
                  set: {
                    bio: body.bio || "",
                    interests: body.interests || [],
                    updatedAt: new Date(),
                  },
                });
            }

            // Save professional profile if mode includes professional
            if (body.mode === "professional" || body.mode === "both") {
              await db
                .insert(professionalProfiles)
                .values({
                  userId: user.id,
                  headline: body.headline || "",
                  bio: body.bio || "",
                  skills: JSON.stringify(body.skills || []),
                  experience: JSON.stringify([]),
                  education: JSON.stringify([]),
                  openToWork: true,
                  openToMentoring: false,
                })
                .onConflictDoUpdate({
                  target: professionalProfiles.userId,
                  set: {
                    headline: body.headline || "",
                    bio: body.bio || "",
                    updatedAt: new Date(),
                  },
                });
            }
          }
        }
      } catch (dbErr) {
        console.error("DB profile setup error:", dbErr);
        // Continue - don't fail the request
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile setup complete! Welcome to AfriMatch.",
    });
  } catch (error) {
    console.error("Profile setup error:", error);
    return NextResponse.json(
      { message: "Failed to save profile. Please try again." },
      { status: 500 }
    );
  }
}
