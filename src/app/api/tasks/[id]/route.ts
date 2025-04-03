import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteSegment = {
  params: {
    id: string;
  };
};

export async function PATCH(request: NextRequest, context: RouteSegment) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { action } = json;

    const task = await prisma.task.findUnique({
      where: { id: context.params.id },
      include: {
        assignedTo: true,
      },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    switch (action) {
      case "assign":
        if (task.status !== "OPEN") {
          return new NextResponse("Task is not available", { status: 400 });
        }

        const updatedTask = await prisma.task.update({
          where: { id: context.params.id },
          data: {
            assignedToId: session.user.id,
            status: "IN_PROGRESS",
          },
        });

        return NextResponse.json(updatedTask);

      case "complete":
        if (
          task.status !== "IN_PROGRESS" ||
          task.assignedToId !== session.user.id
        ) {
          return new NextResponse("Cannot complete this task", { status: 400 });
        }

        // Use a transaction to update both task and user
        const [completedTask] = await prisma.$transaction([
          prisma.task.update({
            where: { id: context.params.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          }),
          prisma.user.update({
            where: { id: session.user.id },
            data: {
              points: {
                increment: task.points,
              },
            },
          }),
        ]);

        return NextResponse.json(completedTask);

      case "delete":
        if (session.user.role !== "MANAGER") {
          return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.task.delete({
          where: { id: context.params.id },
        });

        return new NextResponse(null, { status: 204 });

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("[TASK_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 