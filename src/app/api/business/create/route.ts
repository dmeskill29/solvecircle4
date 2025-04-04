import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBusinessCode } from "@/lib/utils";

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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Business name is required" },
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

    // Generate a unique business code
    let businessCode = generateBusinessCode();
    let isCodeUnique = false;
    while (!isCodeUnique) {
      const existingBusiness = await prisma.business.findUnique({
        where: { code: businessCode },
      });
      if (!existingBusiness) {
        isCodeUnique = true;
      } else {
        businessCode = generateBusinessCode();
      }
    }

    // First update user role to MANAGER
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "MANAGER" },
    });

    // Then create business and connect the user
    const business = await prisma.business.create({
      data: {
        name,
        code: businessCode,
        owner: {
          connect: { id: session.user.id },
        },
        employees: {
          connect: { id: session.user.id },
        },
      },
    });

    // Update session to reflect new role
    if (session.user) {
      session.user.role = "MANAGER";
      session.user.businessId = business.id;
    }

    return NextResponse.json({
      business,
      user: updatedUser,
      message: "Business created successfully",
    });
  } catch (error) {
    console.error("[BUSINESS_CREATE]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 