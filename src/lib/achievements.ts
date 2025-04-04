import { prisma } from "./prisma";

export async function checkAndAwardAchievements(userId: string) {
  // Get user's current stats
  const [tasksCompleted, tasksCreated, user] = await Promise.all([
    prisma.task.count({
      where: {
        assigneeId: userId,
        status: 'COMPLETED'
      }
    }),
    prisma.task.count({
      where: {
        creatorId: userId
      }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, role: true }
    })
  ]);

  if (!user) return;

  // Get all achievements
  const achievements = await prisma.achievement.findMany();
  
  // Get user's current achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true }
  });

  const unlockedAchievementIds = new Set(
    userAchievements.map(ua => ua.achievementId)
  );

  // Check each achievement
  const newAchievements = achievements.filter(achievement => {
    if (unlockedAchievementIds.has(achievement.id)) return false;

    switch (achievement.type) {
      case 'TASKS_COMPLETED':
        return tasksCompleted >= achievement.threshold;
      case 'POINTS_EARNED':
        return user.points >= achievement.threshold;
      case 'TASKS_CREATED':
        return user.role === 'MANAGER' && tasksCreated >= achievement.threshold;
      case 'DAYS_ACTIVE':
        // This would need a separate tracking mechanism
        return false;
      default:
        return false;
    }
  });

  if (newAchievements.length === 0) return;

  // Award new achievements
  await Promise.all([
    // Create achievement records
    ...newAchievements.map(achievement =>
      prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      })
    ),
    // Update user points
    prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: newAchievements.reduce((sum, a) => sum + a.points, 0)
        }
      }
    })
  ]);

  return newAchievements;
} 