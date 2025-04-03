import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "MANAGER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await request.json();

    const { title, description, points } = json;

    if (!title || !description || !points) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        points,
        status: "OPEN",
        createdById: session.user.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assignedToMe = searchParams.get("assignedToMe") === "true";

    const where = {
      OR: [
        ...(assignedToMe ? [{ assignedToId: session.user.id }] : []),
        ...(status ? [{ status }] : []),
      ],
    };

    const tasks = await prisma.task.findMany({
      where: Object.keys(where.OR).length > 0 ? where : undefined,
      include: {
        assignedTo: {
          select: {
            name: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TASKS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 