import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { trackUserActivity } from "@/lib/user-activity";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await trackUserActivity(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking user activity:", error);
    return NextResponse.json(
      { error: "Failed to track user activity" },
      { status: 500 }
    );
  }
} 