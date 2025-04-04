"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface Achievement {
  icon: string;
  name: string;
  description: string;
  points: number;
}

interface TaskActionsProps {
  taskId: string;
  canComplete: boolean;
  isManager: boolean;
}

export default function TaskActions({
  taskId,
  canComplete,
  isManager,
}: TaskActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/assign`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to assign task");
      router.refresh();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Failed to assign task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to complete task");

      const data = await response.json();

      // Show points earned notification
      toast.success(`Task completed! You earned ${data.pointsEarned} points`);

      // Show achievement notifications if any were unlocked
      if (data.newAchievements?.length > 0) {
        data.newAchievements.forEach((achievement: Achievement) => {
          toast.success(
            <div className="flex items-center gap-2">
              <span className="text-xl">{achievement.icon}</span>
              <div>
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-gray-500">
                  {achievement.description}
                </div>
                <div className="text-sm text-primary-600">
                  +{achievement.points} points
                </div>
              </div>
            </div>,
            {
              duration: 5000,
            }
          );
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      toast.success("Task deleted successfully");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {!canComplete && !isManager && (
        <Button onClick={handleAssign} disabled={isLoading}>
          {isLoading ? "Assigning..." : "Assign to me"}
        </Button>
      )}
      {canComplete && (
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? "Completing..." : "Mark as complete"}
        </Button>
      )}
      {isManager && (
        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete task"}
        </Button>
      )}
    </div>
  );
}
