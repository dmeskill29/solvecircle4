import { Card } from "@/components/ui/Card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ManagerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "MANAGER") {
    redirect("/");
  }

  // Get basic task statistics
  const taskStats = await prisma.task.groupBy({
    by: ["status"],
    _count: true,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Manager Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Task Overview</h3>
            <div className="space-y-4">
              {taskStats.map((stat: { status: string; _count: number }) => (
                <div
                  key={stat.status}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600">{stat.status}</span>
                  <span className="font-semibold">{stat._count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
