import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Start a transaction to handle reward redemption
    const result = await prisma.$transaction(async (tx) => {
      // Get the reward and user
      const [reward, user] = await Promise.all([
        tx.rewardItem.findUnique({
          where: { id: params.id },
        }),
        tx.user.findUnique({
          where: { id: session.user.id },
          select: { points: true },
        }),
      ]);

      if (!reward) {
        throw new Error("Reward not found");
      }

      if (!reward.available) {
        throw new Error("Reward is not available");
      }

      if (!user) {
        throw new Error("User not found");
      }

      if (user.points < reward.pointsCost) {
        throw new Error("Not enough points");
      }

      // Create redemption record
      const redemption = await tx.rewardRedemption.create({
        data: {
          userId: session.user.id,
          rewardId: reward.id,
          pointsCost: reward.pointsCost,
        },
      });

      // Deduct points from user
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            decrement: reward.pointsCost,
          },
        },
      });

      return {
        redemption,
        pointsRemaining: user.points - reward.pointsCost,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
} 