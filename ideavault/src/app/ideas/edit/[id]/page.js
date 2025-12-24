"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import Container from "@/components/Container";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditIdeaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchIdea = async () => {
        try {
          const res = await fetch(`/api/getIdea/${id}`);
          const data = await res.json();
          if (data.success) {
            const ideaData = data.data;
            setIdea(ideaData);
            setTitle(ideaData.title);
            setDescription(ideaData.description);
            setCategory(ideaData.category);
            setTags(ideaData.tags.join(", "));
          } else {
            toast.error("Failed to fetch idea details.");
          }
        } catch (error) {
          console.error("Error fetching idea:", error);
          toast.error("An error occurred while fetching the idea.");
        } finally {
          setLoading(false);
        }
      };
      fetchIdea();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
      const res = await fetch("/api/updateIdea", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, description, category, tags: tagsArray }),
      });

      if (res.ok) {
        toast.success("Idea updated successfully!");
        router.push("/profile");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update idea.");
      }
    } catch (error) {
      console.error("Error updating idea:", error);
      toast.error("An error occurred while updating the idea.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster richColors />
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Idea</CardTitle>
            <CardDescription>
              Update the details of your idea below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="text-lg"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="text-lg"
                  />
                   <p className="text-sm text-gray-500">
                    Comma-separated, e.g., web, mobile, AI, sustainability
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={submitting} size="lg">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Updating..." : "Update Idea"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Container>
  );
}
