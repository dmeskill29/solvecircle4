import { prisma } from "./prisma";

interface ActivityLog {
  userId: string;
  date: Date;
}

interface Achievement {
  id: string;
  points: number;
}

// Track user activity for the current day
export async function trackUserActivity(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Check if the model exists
    if (!prisma.userActivityLog) {
      console.warn("UserActivityLog model not available - skipping activity tracking");
      return;
    }

    // Verify the user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      console.warn(`User ${userId} not found - skipping activity tracking`);
      return;
    }

    await prisma.userActivityLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {},
      create: {
        userId,
        date: today,
      },
    });
  } catch (error) {
    console.error("Error in trackUserActivity:", error);
    // Don't throw the error - we want to fail silently if there are DB issues
  }
}

// Get the number of active days for a user
export async function getActiveDays(userId: string): Promise<number> {
  try {
    if (!prisma.userActivityLog) {
      console.warn("UserActivityLog model not available - returning 0 active days");
      return 0;
    }

    const activityLogs = await prisma.userActivityLog.findMany({
      where: {
        userId,
      },
      distinct: ['date'],
    });

    return activityLogs.length;
  } catch (error) {
    console.error("Error in getActiveDays:", error);
    return 0;
  }
}

// Check and award achievements based on active days
export async function checkDaysActiveAchievements(userId: string) {
  try {
    const activeDays = await getActiveDays(userId);

    if (!prisma.achievement || !prisma.userAchievement || !prisma.user) {
      console.warn("Required models not available - skipping achievement check");
      return [];
    }

    const newAchievements = await prisma.achievement.findMany({
      where: {
        type: 'DAYS_ACTIVE',
        threshold: {
          lte: activeDays,
        },
        NOT: {
          users: {
            some: {
              userId,
            },
          },
        },
      },
    });

    if (newAchievements.length === 0) return [];

    // Award achievements and points
    const userAchievements = await Promise.all(
      newAchievements.map((achievement: Achievement) =>
        prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
          include: {
            achievement: true,
          },
        })
      )
    );

    // Calculate and award total points
    const totalPoints = newAchievements.reduce((sum: number, achievement: Achievement) => sum + achievement.points, 0);
    if (totalPoints > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: totalPoints,
          },
        },
      });
    }

    return userAchievements;
  } catch (error) {
    console.error("Error in checkDaysActiveAchievements:", error);
    return [];
  }
} 