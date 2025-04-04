import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Business code is required" },
        { status: 400 }
      );
    }

    // Check if user already has a business
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true, ownedBusiness: true },
    });

    if (existingUser?.business || existingUser?.ownedBusiness) {
      return NextResponse.json(
        { message: "User already belongs to a business" },
        { status: 400 }
      );
    }

    // Find business by code
    const business = await prisma.business.findUnique({
      where: { code },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Invalid business code" },
        { status: 404 }
      );
    }

    // Add user to business
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessId: business.id,
      },
    });

    return NextResponse.json({
      message: "Successfully joined business",
    });
  } catch (error) {
    console.error("[BUSINESS_JOIN]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 