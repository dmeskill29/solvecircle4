import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import RedeemButton from "./RedeemButton";

export default async function RewardsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch available rewards and user's points
  const [rewards, user] = await Promise.all([
    prisma.rewardItem.findMany({
      where: { available: true },
      orderBy: { pointsCost: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards</h1>
          <p className="mt-1 text-sm text-gray-500">
            Redeem your points for exciting rewards
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-primary-600">
            {user?.points || 0} points
          </div>
          <Link href="/rewards/history">
            <Button variant="outline">View History</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{reward.name}</h3>
                <span className="inline-flex items-center rounded-md bg-primary-100 dark:bg-primary-900 px-2 py-1 text-sm font-medium text-primary-700 dark:text-primary-300">
                  {reward.pointsCost} points
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {reward.description}
              </p>
              <RedeemButton
                rewardId={reward.id}
                pointsCost={reward.pointsCost}
                userPoints={user?.points || 0}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
