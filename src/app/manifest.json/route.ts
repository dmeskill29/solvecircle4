import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: "SolveCircle",
      short_name: "SolveCircle",
      description: "A platform for solving problems together",
      start_url: "./",
      scope: "./",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#0284c7",
      orientation: "portrait-primary",
      categories: ["productivity", "business", "utilities"],
      icons: [
        {
          src: "./icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "./icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
} 