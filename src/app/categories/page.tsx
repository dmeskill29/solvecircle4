import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Categories } from "./Categories";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get employee and verify they are a manager
  const employee = await prisma.employee.findFirst({
    where: {
      userId: session.user.id,
      isManager: true,
    },
    include: {
      business: true,
    },
  });

  if (!employee) {
    redirect("/");
  }

  // Get business categories
  const categories = await prisma.taskCategory.findMany({
    where: {
      businessId: employee.businessId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Task Categories</h1>
          <p className="text-muted-foreground">
            Manage task categories for your business. Categories help organize
            and filter tasks effectively.
          </p>
        </div>

        <Categories categories={categories} businessId={employee.businessId} />
      </div>
    </div>
  );
}
