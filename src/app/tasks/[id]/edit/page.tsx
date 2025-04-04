import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TaskForm from "../../new/TaskForm";

export default async function EditTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const employee = await prisma.employee.findFirst({
    where: {
      userId: session.user.id,
      isManager: true,
    },
    include: {
      business: {
        include: {
          employees: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          categories: true,
        },
      },
    },
  });

  if (!employee) {
    redirect("/dashboard");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
      businessId: employee.businessId,
    },
    include: {
      assignedTo: true,
      category: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      <div className="max-w-2xl">
        <TaskForm
          employees={employee.business.employees}
          categories={employee.business.categories}
          businessId={employee.businessId}
          task={task}
        />
      </div>
    </div>
  );
}
