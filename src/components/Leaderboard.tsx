"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Achievement {
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: Date;
}

interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  points: number;
  achievements: Achievement[];
}

interface LeaderboardProps {
  className?: string;
}

export default function Leaderboard({ className = "" }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [period, setPeriod] = useState<"all-time" | "monthly" | "weekly">(
    "all-time"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaderboard?period=${period}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("all-time")}
            className={`px-4 py-2 rounded ${
              period === "all-time"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-4 py-2 rounded ${
              period === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-4 py-2 rounded ${
              period === "weekly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 w-12 text-2xl font-bold text-gray-500 text-center">
              #{index + 1}
            </div>
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {user.name?.[0] || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">
                {user.name || "Anonymous"}
              </h3>
              <div className="flex gap-2 mt-1">
                {user.achievements.slice(0, 3).map((achievement) => (
                  <span
                    key={achievement.name}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    title={achievement.description}
                  >
                    {achievement.icon} {achievement.name}
                  </span>
                ))}
                {user.achievements.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{user.achievements.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-xl font-bold text-blue-500">
              {user.points} pts
            </div>
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No data available for this time period
          </div>
        )}
      </div>
    </div>
  );
}
