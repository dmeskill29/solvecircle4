"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

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
      router.refresh();
    } catch (error) {
      console.error("Error completing task:", error);
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
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
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
