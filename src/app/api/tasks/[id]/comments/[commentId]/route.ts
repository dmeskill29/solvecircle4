import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get comment and verify ownership
    const comment = await prisma.taskComment.findFirst({
      where: {
        id: params.commentId,
        taskId: params.id,
        author: {
          user: {
            id: session.user.id,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found or not authorized to delete" },
        { status: 404 }
      );
    }

    await prisma.taskComment.delete({
      where: {
        id: params.commentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
} 