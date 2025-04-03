import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type TaskWithRelations = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  points: number;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  assigneeId: string | null;
  completedAt: Date | null;
  assignedTo: {
    name: string;
    image: string | null;
  } | null;
  createdBy: {
    name: string;
  };
};

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  const tasks = (await prisma.task.findMany({
    where: {
      OR: [{ assigneeId: session?.user?.id }, { status: "OPEN" }],
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
  })) as TaskWithRelations[];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Tasks</h1>
          <p className="text-gray-500">
            Manage and complete tasks to earn points
          </p>
        </div>
        {session?.user?.role === "MANAGER" && (
          <Link href="/tasks/create">
            <Button>Create Task</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`}>
            <Card variant="hover" className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      task.status === "OPEN"
                        ? "bg-blue-50 text-blue-700"
                        : task.status === "IN_PROGRESS"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-green-50 text-green-700"
                    )}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                      <span className="text-gray-600">
                        {task.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                    <span className="font-medium text-primary-600">
                      {task.points} points
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-sm text-gray-500">
                {session?.user?.role === "MANAGER"
                  ? "Create a task to get started"
                  : "Check back later for new tasks"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
