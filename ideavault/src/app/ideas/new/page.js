"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewIdeaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
      const res = await fetch("/api/createIdea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, category, tags: tagsArray }),
      });

      if (res.ok) {
        toast.success("Idea created successfully!");
        router.push("/ideas");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to create idea.");
      }
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("An error occurred while creating the idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster richColors />
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create a New Idea</CardTitle>
            <CardDescription>
              Fill out the form below to share your brilliant idea with the world.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's the title of your idea?"
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
                    placeholder="Describe your idea in detail..."
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
                    placeholder="e.g., Technology, Healthcare, Education"
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
                    placeholder="Add relevant tags, separated by commas"
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
              <Button type="submit" disabled={loading} size="lg">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit Idea"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Container>
  );
}
