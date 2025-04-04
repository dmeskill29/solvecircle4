import type { NextApiRequest, NextApiResponse } from 'next';

// Disable the default body parser to ensure raw JSON response
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set headers first to ensure they're always sent
  res.setHeader('Content-Type', 'application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    // Return JSON error response
    const error = JSON.stringify({ message: 'Method not allowed' });
    return res.status(405).send(error);
  }

  const manifest = {
    name: "SolveCircle",
    short_name: "SolveCircle",
    description: "A platform for solving problems together",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    orientation: "portrait-primary",
    categories: ["productivity", "business", "utilities"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
  
  // Send raw JSON response
  return res.status(200).send(JSON.stringify(manifest));
} 