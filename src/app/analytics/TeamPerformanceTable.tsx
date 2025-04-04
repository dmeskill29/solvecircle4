"use client";

interface EmployeeData {
  id: string;
  name: string | null;
  points: number;
  assignedTasks: {
    status: string;
  }[];
}

interface TeamPerformanceTableProps {
  data: EmployeeData[];
}

export default function TeamPerformanceTable({
  data,
}: TeamPerformanceTableProps) {
  // Calculate metrics for each employee
  const employeeMetrics = data.map((employee) => {
    const totalTasks = employee.assignedTasks.length;
    const completedTasks = employee.assignedTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
    const inProgressTasks = employee.assignedTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    const completionRate = totalTasks
      ? ((completedTasks / totalTasks) * 100).toFixed(1)
      : "0.0";

    return {
      ...employee,
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Employee
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Points
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Total Tasks
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Completed
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              In Progress
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Completion Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {employeeMetrics.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {employee.name || "Unnamed"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.points}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.totalTasks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.completedTasks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.inProgressTasks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {employee.completionRate}%
              </td>
            </tr>
          ))}
          {employeeMetrics.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
              >
                No team members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
