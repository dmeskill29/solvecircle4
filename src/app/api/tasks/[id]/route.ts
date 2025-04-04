import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteSegment = {
  params: {
    id: string;
  };
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: "Not authorized to update tasks" },
        { status: 403 }
      );
    }

    // Verify task exists and belongs to the business
    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        businessId,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
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

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        assignedToId,
        categoryId: categoryId || null,
        priority,
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, priority, categoryId } = await request.json();

    // Get task and verify user has access
    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        business: {
          employees: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    // Only assigned user can update status
    if (status && task.assignedTo.user.id !== session.user.id) {
      return NextResponse.json(
        { error: "Only assigned user can update task status" },
        { status: 403 }
      );
    }

    // Verify category belongs to the business if provided
    if (categoryId) {
      const category = await prisma.taskCategory.findFirst({
        where: {
          id: categoryId,
          businessId: task.businessId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (priority) {
      updateData.priority = priority;
    }

    if (categoryId !== undefined) {
      updateData.categoryId = categoryId || null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get task and verify user is a manager of the business
    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        business: {
          employees: {
            some: {
              userId: session.user.id,
              isManager: true,
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
} 