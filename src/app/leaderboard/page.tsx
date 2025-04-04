import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>
      <p className="text-gray-600 mb-8">
        Track your progress and compete with your colleagues. Complete tasks,
        earn achievements, and climb the ranks!
      </p>
      <Leaderboard className="max-w-4xl mx-auto" />
    </div>
  );
}
