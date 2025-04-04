import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { getTaskById, getTaskMetadata } from "@/lib/tasks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskDetails } from "./TaskDetails";
import { TaskComments } from "./TaskComments";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const task = await getTaskMetadata(params.id);

  if (!task) {
    return { title: "Task Not Found" };
  }

  return {
    title: `Task: ${task.title}`,
    description: `View details for task ${task.title}`,
  };
}

function TaskNotFound() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Task Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The task you're looking for doesn't exist.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function TaskPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get employee and their business
  const employee = await prisma.employee.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      business: true,
    },
  });

  if (!employee) {
    redirect("/");
  }

  // Get task with all related data
  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
      businessId: employee.businessId,
    },
    include: {
      assignedTo: {
        include: {
          user: true,
        },
      },
      createdBy: {
        include: {
          user: true,
        },
      },
      category: true,
      comments: {
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <TaskDetails
          task={task}
          isManager={employee.isManager}
          isAssigned={task.assignedTo.userId === session.user.id}
        />
        <TaskComments
          taskId={task.id}
          comments={task.comments}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
