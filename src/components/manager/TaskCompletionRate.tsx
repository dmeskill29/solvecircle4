"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface TaskCompletionRateProps {
  rate: number;
  completed: number;
  total: number;
}

export function TaskCompletionRate({
  rate,
  completed,
  total,
}: TaskCompletionRateProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            data: [rate, 100 - rate],
            backgroundColor: ["#22c55e", "#e5e7eb"],
            borderWidth: 0,
            cutout: "80%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [rate]);

  return (
    <div className="relative w-full h-[200px]">
      <canvas ref={chartRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-900">{rate}%</div>
        <div className="text-sm text-gray-500">
          {completed} of {total} tasks completed
        </div>
      </div>
    </div>
  );
}
