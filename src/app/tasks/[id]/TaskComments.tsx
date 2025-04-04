"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Employee {
  id: string;
  user: User;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: Employee;
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  userId: string;
}

export function TaskComments({ taskId, comments, userId }: TaskCommentsProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setContent("");
      toast.success("Comment added successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            Add Comment
          </Button>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={comment.author.user.image || undefined}
                  alt={comment.author.user.name || "User"}
                />
                <AvatarFallback>
                  {comment.author.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.author.user.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.createdAt), "PPp")}
                    </span>
                  </div>
                  {comment.author.user.id === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        if (
                          !confirm(
                            "Are you sure you want to delete this comment?"
                          )
                        ) {
                          return;
                        }

                        try {
                          const response = await fetch(
                            `/api/tasks/${taskId}/comments/${comment.id}`,
                            {
                              method: "DELETE",
                            }
                          );

                          if (!response.ok) {
                            throw new Error("Failed to delete comment");
                          }

                          toast.success("Comment deleted successfully");
                          router.refresh();
                        } catch (error) {
                          toast.error("Failed to delete comment");
                          console.error(error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
