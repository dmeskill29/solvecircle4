"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface RedeemButtonProps {
  rewardId: string;
  pointsCost: number;
  userPoints: number;
}

export default function RedeemButton({
  rewardId,
  pointsCost,
  userPoints,
}: RedeemButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const canAfford = userPoints >= pointsCost;

  const handleRedeem = async () => {
    if (!canAfford) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/rewards/${rewardId}/redeem`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to redeem reward");
      }

      const data = await response.json();
      toast.success("Reward redeemed successfully!");

      // Refresh the page to update points
      window.location.reload();
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("Failed to redeem reward. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRedeem}
      disabled={!canAfford || isLoading}
      className="w-full"
      variant={canAfford ? "default" : "secondary"}
    >
      {isLoading
        ? "Redeeming..."
        : canAfford
        ? "Redeem Reward"
        : "Not enough points"}
    </Button>
  );
}
