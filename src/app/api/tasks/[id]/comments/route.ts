import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get employee and verify they belong to the task's business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        business: {
          tasks: {
            some: {
              id: params.id,
            },
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Not authorized to view task comments" },
        { status: 403 }
      );
    }

    const comments = await prisma.taskComment.findMany({
      where: {
        taskId: params.id,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();

    // Get employee and verify they belong to the task's business
    const employee = await prisma.employee.findFirst({
      where: {
        userId: session.user.id,
        business: {
          tasks: {
            some: {
              id: params.id,
            },
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Not authorized to comment on this task" },
        { status: 403 }
      );
    }

    const comment = await prisma.taskComment.create({
      data: {
        content,
        taskId: params.id,
        authorId: employee.id,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
} 