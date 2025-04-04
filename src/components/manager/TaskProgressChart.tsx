"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { TaskStatus } from "@prisma/client";

Chart.register(...registerables);

interface TaskProgressChartProps {
  data: Record<TaskStatus, number>;
}

const statusColors = {
  OPEN: "#3b82f6", // blue-500
  IN_PROGRESS: "#eab308", // yellow-500
  COMPLETED: "#22c55e", // green-500
  CANCELLED: "#ef4444", // red-500
};

const statusLabels = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function TaskProgressChart({ data }: TaskProgressChartProps) {
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

    const statuses = Object.keys(data) as TaskStatus[];
    const values = statuses.map((status) => data[status]);
    const colors = statuses.map((status) => statusColors[status]);
    const labels = statuses.map((status) => statusLabels[status]);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tasks",
            data: values,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
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
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `${value} task${value === 1 ? "" : "s"}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
}
