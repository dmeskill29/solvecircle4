import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { redirect } from "next/navigation";
import { Achievement, UserAchievement, AchievementType } from "@prisma/client";

type UserAchievementWithAchievement = UserAchievement & {
  achievement: Achievement;
};

type ProgressMap = {
  [K in AchievementType]: number;
};

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch all achievements and user's unlocked achievements
  const [achievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({
      orderBy: {
        threshold: "asc",
      },
    }),
    prisma.userAchievement.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        achievement: true,
      },
    }),
  ]);

  // Create a map of unlocked achievements for easy lookup
  const unlockedMap = new Map(
    userAchievements.map((ua: UserAchievementWithAchievement) => [
      ua.achievementId,
      ua,
    ])
  );

  // Calculate progress for each achievement type
  const progress: ProgressMap = {
    TASKS_COMPLETED: await prisma.task.count({
      where: {
        assigneeId: session.user.id,
        status: "COMPLETED",
      },
    }),
    POINTS_EARNED: session.user.points,
    TASKS_CREATED:
      session.user.role === "MANAGER"
        ? await prisma.task.count({
            where: {
              creatorId: session.user.id,
            },
          })
        : 0,
    DAYS_ACTIVE: 0, // This would need a separate tracking mechanism
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Achievements</h1>
        <p className="text-gray-500">Track your progress and unlock rewards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement: Achievement) => {
          const unlocked = unlockedMap.get(achievement.id) as
            | UserAchievementWithAchievement
            | undefined;
          const currentProgress = progress[achievement.type];
          const progressPercentage = Math.min(
            (currentProgress / achievement.threshold) * 100,
            100
          );

          return (
            <Card
              key={achievement.id}
              className={`${
                unlocked ? "bg-gradient-to-br from-primary-50 to-accent-50" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span>{achievement.name}</span>
                  </CardTitle>
                  {unlocked && (
                    <div className="text-sm text-accent-600">
                      Unlocked{" "}
                      {new Date(unlocked.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {achievement.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {currentProgress}/{achievement.threshold}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-right text-primary-600">
                    {achievement.points} points reward
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
