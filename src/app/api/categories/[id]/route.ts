import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get category and verify user is a manager of the business
    const category = await prisma.taskCategory.findFirst({
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

    if (!category) {
      return NextResponse.json(
        { error: "Category not found or not authorized to delete" },
        { status: 404 }
      );
    }

    // Remove category from all tasks
    await prisma.task.updateMany({
      where: {
        categoryId: params.id,
      },
      data: {
        categoryId: null,
      },
    });

    // Delete the category
    await prisma.taskCategory.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, color } = await request.json();

    // Get category and verify user is a manager of the business
    const category = await prisma.taskCategory.findFirst({
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

    if (!category) {
      return NextResponse.json(
        { error: "Category not found or not authorized to update" },
        { status: 404 }
      );
    }

    // Check if another category with the same name exists in the business
    if (name !== category.name) {
      const existingCategory = await prisma.taskCategory.findFirst({
        where: {
          name,
          businessId: category.businessId,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.taskCategory.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        color,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
} 