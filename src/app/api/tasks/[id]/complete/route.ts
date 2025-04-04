import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type UserAchievementWithAchievement = Prisma.UserAchievementGetPayload<{
  include: {
    achievement: true;
  };
}>;

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Start a transaction to handle task completion, points, and achievements
    const result = await prisma.$transaction(async (tx) => {
      // Get the task
      const task = await tx.task.findUnique({
        where: { id: params.id },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      if (task.status === "COMPLETED") {
        throw new Error("Task is already completed");
      }

      if (task.assigneeId !== session.user.id) {
        throw new Error("You are not assigned to this task");
      }

      // Update task status
      const updatedTask = await tx.task.update({
        where: { id: params.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Award points to user
      const user = await tx.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            increment: task.points,
          },
        },
      });

      // Check for achievements
      const completedTasksCount = await tx.task.count({
        where: {
          assigneeId: session.user.id,
          status: "COMPLETED",
        },
      });

      // Get all achievements that could be unlocked
      const eligibleAchievements = await tx.achievement.findMany({
        where: {
          OR: [
            {
              type: "TASKS_COMPLETED",
              threshold: {
                lte: completedTasksCount,
              },
            },
            {
              type: "POINTS_EARNED",
              threshold: {
                lte: user.points,
              },
            },
          ],
          // Exclude already unlocked achievements
          NOT: {
            users: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          type: true,
          threshold: true,
          points: true,
        },
      });

      // Unlock new achievements
      const newAchievements = await Promise.all(
        eligibleAchievements.map((achievement) =>
          tx.userAchievement.create({
            data: {
              userId: session.user.id,
              achievementId: achievement.id,
            },
            include: {
              achievement: true,
            },
          })
        )
      ) as UserAchievementWithAchievement[];

      // Calculate total points earned (task points + achievement points)
      const achievementPoints = newAchievements.reduce(
        (total: number, ua: UserAchievementWithAchievement) =>
          total + ua.achievement.points,
        0
      );

      if (achievementPoints > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            points: {
              increment: achievementPoints,
            },
          },
        });
      }

      return {
        task: updatedTask,
        pointsEarned: task.points + achievementPoints,
        newAchievements: newAchievements.map(
          (ua: UserAchievementWithAchievement) => ua.achievement
        ),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
} 