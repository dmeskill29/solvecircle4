import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection with a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount,
      databaseUrl: process.env.DATABASE_URL?.replace(
        /postgresql:\/\/[^:]+:[^@]+@/,
        "postgresql://[USER]:[PASSWORD]@"
      )
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    // Get detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? stack : undefined,
        databaseUrl: process.env.DATABASE_URL?.replace(
          /postgresql:\/\/[^:]+:[^@]+@/,
          "postgresql://[USER]:[PASSWORD]@"
        )
      },
      { status: 500 }
    );
  }
} 