import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import TaskActions from "./TaskActions";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const task = await prisma.task.findUnique({
    where: {
      id: params.id,
    },
    include: {
      assignedTo: true,
      completedBy: true,
    },
  });

  if (!task) {
    notFound();
  }

  const isAssigned = task.assignedToId === session.user.id;
  const isCompleted = task.completedById === session.user.id;
  const canComplete = isAssigned && !isCompleted;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex items-center space-x-4">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              task.status === "OPEN"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {task.status}
          </span>
          <span className="text-sm text-gray-500">Points: {task.points}</span>
        </div>
        <p className="text-gray-700">{task.description}</p>
        {task.assignedTo && (
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={task.assignedTo.image || "/placeholder-avatar.png"}
                  alt={task.assignedTo.name || "User avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{task.assignedTo.name}</p>
                <p className="text-sm text-gray-500">Assigned to</p>
              </div>
            </div>
          </Card>
        )}
        {task.completedBy && (
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={task.completedBy.image || "/placeholder-avatar.png"}
                  alt={task.completedBy.name || "User avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{task.completedBy.name}</p>
                <p className="text-sm text-gray-500">Completed by</p>
              </div>
            </div>
          </Card>
        )}
        {task.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={task.imageUrl}
              alt={task.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      {session?.user && (
        <TaskActions
          taskId={task.id}
          canComplete={canComplete}
          isManager={session.user.role === "MANAGER"}
        />
      )}
    </div>
  );
}
