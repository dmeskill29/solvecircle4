import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilters";

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

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      business: {
        include: {
          owner: true,
          employees: true,
          categories: true,
        },
      },
    },
  });

  if (!user?.business) {
    redirect("/dashboard");
  }

  const where: any = {
    businessId: user.business.id,
  };

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.priority) {
    where.priority = searchParams.priority;
  }

  if (searchParams.categoryId) {
    where.categoryId = searchParams.categoryId;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignedTo: true,
      createdBy: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <TaskFilters categories={user.business.categories} />
      <TaskList tasks={tasks} />
    </div>
  );
}
