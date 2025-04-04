import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for task creation validation
const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  points: z.number().int().min(1).max(100),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      assignedToId,
      categoryId,
      priority,
      businessId,
    } = await request.json();

    // Verify user has access to the business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        businessId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Not authorized to create tasks" },
        { status: 403 }
      );
    }

    // Verify assigned user exists and belongs to the business
    const assignedEmployee = await prisma.employee.findFirst({
      where: {
        id: assignedToId,
        businessId,
      },
    });

    if (!assignedEmployee) {
      return NextResponse.json(
        { error: "Invalid assigned user" },
        { status: 400 }
      );
    }

    // Verify category belongs to the business if provided
    if (categoryId) {
      const category = await prisma.taskCategory.findFirst({
        where: {
          id: categoryId,
          businessId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: "PENDING",
        priority: priority || "MEDIUM",
        businessId,
        assignedToId,
        categoryId,
        createdById: employee.id,
      },
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
        createdBy: {
          include: {
            user: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// Get all tasks
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const status = searchParams.get("status");
    const assignedToId = searchParams.get("assignedToId");
    const categoryId = searchParams.get("categoryId");
    const priority = searchParams.get("priority");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to the business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        businessId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Not authorized to view tasks" },
        { status: 403 }
      );
    }

    const where: any = {
      businessId,
    };

    if (status) {
      where.status = status;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
        createdBy: {
          include: {
            user: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
} 