"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  createdBy: {
    name: string | null;
    email: string | null;
  };
}

interface TaskListProps {
  tasks: Task[];
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/tasks/${task.id}`}
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 items-center text-sm">
                {task.assignedTo && (
                  <Badge variant="outline">
                    {task.assignedTo.name || task.assignedTo.email}
                  </Badge>
                )}
                <Badge
                  className={
                    statusColors[task.status as keyof typeof statusColors]
                  }
                >
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge
                  className={
                    priorityColors[task.priority as keyof typeof priorityColors]
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <time
              dateTime={task.createdAt}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {format(new Date(task.createdAt), "MMM d, yyyy")}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}
