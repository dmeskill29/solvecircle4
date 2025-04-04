import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, color, businessId } = await request.json();

    // Verify user is a manager of the business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        businessId,
        isManager: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Not authorized to create categories" },
        { status: 403 }
      );
    }

    // Check if category with same name already exists in the business
    const existingCategory = await prisma.taskCategory.findFirst({
      where: {
        name,
        businessId,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.taskCategory.create({
      data: {
        name,
        description,
        color,
        businessId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get employee's business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        businessId: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const categories = await prisma.taskCategory.findMany({
      where: {
        businessId: employee.businessId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 