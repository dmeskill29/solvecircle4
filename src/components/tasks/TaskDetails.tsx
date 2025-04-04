import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Task, User } from "@prisma/client";
import TaskActions from "@/app/tasks/[id]/TaskActions";

// Base64 encoded simple placeholder avatar
const placeholderAvatar =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI0U1RTdFQiIvPjxwYXRoIGQ9Ik0yMCAxOUMyMi4yMDkxIDE5IDI0IDE3LjIwOTEgMjQgMTVDMjQgMTIuNzkwOSAyMi4yMDkxIDExIDIwIDExQzE3Ljc5MDkgMTEgMTYgMTIuNzkwOSAxNiAxNUMxNiAxNy4yMDkxIDE3Ljc5MDkgMTkgMjAgMTlaIiBmaWxsPSIjOTRBM0IyIi8+PHBhdGggZD0iTTI2IDI5QzI2IDI1LjEzNCAyMy4zMTM3IDIyIDIwIDIyQzE2LjY4NjMgMjIgMTQgMjUuMTM0IDE0IDI5SDI2WiIgZmlsbD0iIzk0QTNCMiIvPjwvc3ZnPg==";

interface TaskDetailsProps {
  task: Task & {
    assignedTo: User | null;
    createdBy: User;
  };
  currentUser: {
    id: string;
    role: User["role"];
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function TaskDetails({ task, currentUser }: TaskDetailsProps) {
  const isAssigned = task.assigneeId === currentUser.id;
  const canComplete = isAssigned && task.status === "OPEN";

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
                  src={task.assignedTo.image || placeholderAvatar}
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
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={task.createdBy.image || placeholderAvatar}
                alt={task.createdBy.name || "User avatar"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{task.createdBy.name}</p>
              <p className="text-sm text-gray-500">Created by</p>
            </div>
          </div>
        </Card>
      </div>
      <TaskActions
        taskId={task.id}
        canComplete={canComplete}
        isManager={currentUser.role === "MANAGER"}
      />
    </div>
  );
}
