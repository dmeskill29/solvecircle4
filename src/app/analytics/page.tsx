import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TaskCompletionChart from "./TaskCompletionChart";
import TeamPerformanceTable from "./TeamPerformanceTable";
import TaskStatusDistribution from "./TaskStatusDistribution";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is a manager
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (user?.role !== "MANAGER") {
    redirect("/dashboard");
  }

  // Get business employees
  const employees = await prisma.user.findMany({
    where: {
      businessId: user.businessId,
      role: "EMPLOYEE",
    },
    select: {
      id: true,
      name: true,
      points: true,
      assignedTasks: {
        select: {
          status: true,
        },
      },
    },
  });

  // Calculate task completion stats for the past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedTasks = await prisma.task.findMany({
    where: {
      business: { id: user.businessId },
      status: "COMPLETED",
      completedAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      completedAt: true,
      points: true,
      assignedTo: {
        select: {
          name: true,
        },
      },
    },
  });

  // Get task status distribution
  const taskStatusCounts = await prisma.task.groupBy({
    by: ["status"],
    where: {
      business: { id: user.businessId },
    },
    _count: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your team's performance and task completion metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Task Completion Trend</h2>
          </CardHeader>
          <CardContent>
            <TaskCompletionChart data={completedTasks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Task Status Distribution</h2>
          </CardHeader>
          <CardContent>
            <TaskStatusDistribution data={taskStatusCounts} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Team Performance</h2>
        </CardHeader>
        <CardContent>
          <TeamPerformanceTable data={employees} />
        </CardContent>
      </Card>
    </div>
  );
}
