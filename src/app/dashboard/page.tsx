import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get user's tasks statistics
  const taskStats = await prisma.task.groupBy({
    by: ["status"],
    where: {
      assigneeId: session.user.id,
    },
    _count: true,
  });

  // Get user's recent achievements
  const recentAchievements = await prisma.userAchievement.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      achievement: true,
    },
    orderBy: {
      unlockedAt: "desc",
    },
    take: 5,
  });

  // Get user's recent tasks
  const recentTasks = await prisma.task.findMany({
    where: {
      assigneeId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Your Points
            </h2>
            <div className="text-3xl font-bold text-primary-600">
              {session.user.points}
            </div>
            <p className="mt-1 text-sm text-gray-500">Total points earned</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Task Status
            </h2>
            <dl className="grid grid-cols-1 gap-4">
              {taskStats.map((stat) => (
                <div key={stat.status} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{stat.status}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {stat._count}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Achievements
            </h2>
            {recentAchievements.length > 0 ? (
              <ul className="space-y-4">
                {recentAchievements.map((ua) => (
                  <li key={ua.id} className="flex items-center gap-2">
                    <span className="text-xl">{ua.achievement.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ua.achievement.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(ua.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No achievements yet</p>
            )}
          </div>
        </Card>

        <Card className="col-span-full">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Tasks
            </h2>
            {recentTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tasks yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
