"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { format, subDays } from "date-fns";

interface TaskData {
  completedAt: string;
  points: number;
  assignedTo: {
    name: string | null;
  } | null;
}

interface TaskCompletionChartProps {
  data: TaskData[];
}

export default function TaskCompletionChart({
  data,
}: TaskCompletionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process data for the last 30 days
    const today = new Date();
    const dailyCompletions: { [key: string]: number } = {};

    // Initialize all days with 0
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      dailyCompletions[dateStr] = 0;
    }

    // Count completions per day
    data.forEach((task) => {
      const dateStr = format(new Date(task.completedAt), "yyyy-MM-dd");
      if (dailyCompletions[dateStr] !== undefined) {
        dailyCompletions[dateStr]++;
      }
    });

    const labels = Object.keys(dailyCompletions);
    const values = Object.values(dailyCompletions);

    // Create new chart
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map((date) => format(new Date(date), "MMM d")),
        datasets: [
          {
            label: "Tasks Completed",
            data: values,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
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
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
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
