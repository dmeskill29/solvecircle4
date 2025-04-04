"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface TaskStatusCount {
  status: string;
  _count: number;
}

interface TaskStatusDistributionProps {
  data: TaskStatusCount[];
}

const statusColors = {
  OPEN: "rgb(239, 68, 68)", // red
  IN_PROGRESS: "rgb(59, 130, 246)", // blue
  COMPLETED: "rgb(34, 197, 94)", // green
  CANCELLED: "rgb(156, 163, 175)", // gray
};

export default function TaskStatusDistribution({
  data,
}: TaskStatusDistributionProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = data.map((item) => item.status);
    const values = data.map((item) => item._count);
    const colors = data.map(
      (item) => statusColors[item.status as keyof typeof statusColors]
    );

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right" as const,
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
}
