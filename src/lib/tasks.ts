import { prisma } from "./prisma";
import { Task, User } from "@prisma/client";

export type TaskWithRelations = Task & {
  assignedTo: User | null;
  createdBy: User;
};

export async function getTaskById(id: string): Promise<TaskWithRelations | null> {
  try {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
}

export async function getTaskMetadata(id: string) {
  try {
    return await prisma.task.findUnique({
      where: { id },
      select: { title: true },
    });
  } catch (error) {
    console.error("Error fetching task metadata:", error);
    return null;
  }
}

export async function getUserTasks(userId: string) {
  try {
    return await prisma.task.findMany({
      where: {
        OR: [{ assigneeId: userId }, { status: "OPEN" }],
      },
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
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }
} 