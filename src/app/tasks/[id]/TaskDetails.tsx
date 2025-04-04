"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Employee {
  id: string;
  user: User;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: Employee;
  createdBy: Employee;
  category: Category | null;
}

interface TaskDetailsProps {
  task: Task;
  isManager: boolean;
  isAssigned: boolean;
}

const statusColors = {
  PENDING: "bg-yellow-500",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

const priorityColors = {
  LOW: "bg-gray-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
};

export function TaskDetails({ task, isManager, isAssigned }: TaskDetailsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      setStatus(newStatus);
      toast.success("Task status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update task status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task priority");
      }

      setPriority(newPriority);
      toast.success("Task priority updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update task priority");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast.success("Task deleted successfully");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
          {isManager && (
            <div className="flex items-center gap-2">
              <Link href={`/tasks/${task.id}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isUpdating}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Created by {task.createdBy.user.name}</span>
          <span>•</span>
          <span>{format(new Date(task.createdAt), "PPp")}</span>
          {task.updatedAt > task.createdAt && (
            <>
              <span>•</span>
              <span>Updated {format(new Date(task.updatedAt), "PPp")}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {isAssigned ? (
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  className={`${
                    statusColors[status as keyof typeof statusColors]
                  }`}
                >
                  {status.replace("_", " ")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Priority:</span>
              {isManager ? (
                <Select
                  value={priority}
                  onValueChange={handlePriorityChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  className={`${
                    priorityColors[priority as keyof typeof priorityColors]
                  }`}
                >
                  {priority}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Assigned to:</span>
            <span>{task.assignedTo.user.name}</span>
          </div>
          {task.category && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <Badge
                style={{
                  backgroundColor: task.category.color,
                  color: "white",
                }}
              >
                {task.category.name}
              </Badge>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
