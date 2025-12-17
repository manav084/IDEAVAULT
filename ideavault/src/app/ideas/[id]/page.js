"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, CalendarDays, UserCircle, MessageSquare } from "lucide-react";
import Container from "@/components/Container";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      const fetchIdeaAndComments = async () => {
        try {
          // Fetch idea
          const ideaRes = await fetch(`/api/admin/getIdea/${id}`);
          const ideaData = await ideaRes.json();
          setIdea(ideaData.data);

          // Fetch comments
          const commentsRes = await fetch(`/api/getComments/${id}`);
          const commentsData = await commentsRes.json();
          if (commentsData.success) {
            setComments(commentsData.data);
          }

        } catch (error) {
          console.error("Failed to fetch idea or comments:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIdeaAndComments();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: id, text: newComment }),
      });

      const result = await res.json();

      if (result.success) {
        setComments((prevComments) => [result.data, ...prevComments]);
        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        toast.error(result.message || "Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding the comment.");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="container mx-auto p-4 lg:p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content skeleton */}
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-48 w-full" />
            </div>
            {/* Sidebar skeleton */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!idea) {
    return (
      <Container>
        <div className="container mx-auto p-4 lg:p-8 text-center">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Idea Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                The idea you are looking for does not exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container>
      <Toaster richColors />
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">{idea.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {idea.title}
              </h1>
            </div>
            <div className="prose prose-xl dark:prose-invert max-w-none">
              <p>{idea.description}</p>
            </div>

            <Separator className="my-8" />

            {/* Comments Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                <span>Discussion ({comments?.length || 0})</span>
              </h2>
              
              {/* Add Comment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Leave a Comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full gap-4">
                    <Textarea 
                      placeholder="Type your message here." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment}>Post Comment</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-6">
                {comments?.map((comment) => (
                  <Card key={comment._id}>
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.createdBy?.username}`} alt={comment.createdBy?.username} />
                        <AvatarFallback>{comment.createdBy?.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{comment.createdBy?.name || comment.createdBy?.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {comment.text}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6 lg:mt-0 mt-8">
            {/* Author Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${idea.createdBy?.username}`}
                    alt={idea.createdBy?.username}
                  />
                  <AvatarFallback>
                    {idea.createdBy?.username ? idea.createdBy.username[0].toUpperCase() : <UserCircle />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{idea.createdBy?.name || idea.createdBy?.username || "Anonymous"}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Voting Card */}
            <Card>
              <CardHeader>
                <CardTitle>Was this idea helpful?</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-around gap-4">
                <Button variant="outline" size="lg" className="flex-1 flex items-center gap-2">
                  <ThumbsUp />
                  <span>Yes</span>
                </Button>
                <Button variant="outline" size="lg" className="flex-1 flex items-center gap-2">
                  <ThumbsDown />
                  <span>No</span>
                </Button>
              </CardContent>
            </Card>

            {/* Tags Card */}
            {idea.tags && idea.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </Container>
  );
}
