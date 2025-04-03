import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  points: number;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  assigneeId: string | null;
};

type RewardItem = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  available: boolean;
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="text-center">
        <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-32 sm:text-6xl">
          Welcome to SolveCircle
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A gamified task management platform where completing tasks earns you
          points for rewards.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/signin"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const [tasks, rewards] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: session.user.id },
          { assigneeId: null, status: "OPEN" },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.rewardItem.findMany({
      where: { available: true },
      orderBy: { pointsCost: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          You have {session.user.points} points available.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
          <Link
            href="/tasks"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <ul role="list" className="mt-4 divide-y divide-gray-100">
          {tasks.map((task: Task) => (
            <li key={task.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {task.description}
                  </p>
                </div>
                <div className="ml-4 flex items-center space-x-4">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    {task.points} points
                  </span>
                  {!task.assigneeId && (
                    <Link
                      href={`/tasks/${task.id}`}
                      className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Take task
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="py-4 text-center text-sm text-gray-500">
              No tasks available at the moment.
            </li>
          )}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Available Rewards
          </h2>
          <Link
            href="/rewards"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <ul
          role="list"
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rewards.map((reward: RewardItem) => (
            <li
              key={reward.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div>
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {reward.name}
                  </h3>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {reward.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    {reward.pointsCost} points
                  </span>
                </div>
              </div>
            </li>
          ))}
          {rewards.length === 0 && (
            <li className="col-span-full py-4 text-center text-sm text-gray-500">
              No rewards available at the moment.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
