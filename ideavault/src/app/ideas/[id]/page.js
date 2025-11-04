"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "@/components/Container";

// Placeholder for a simple star rating component
const StarRating = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{label}:</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function IdeaDetailPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [impactRating, setImpactRating] = useState(0);
  const [feasibilityRating, setFeasibilityRating] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchIdea = async () => {
        try {
          // Replace with your actual API endpoint for fetching a single idea
          const res = await fetch(`/api/admin/getIdea/${id}`);
          const data = await res.json();
          setIdea(data.data);
          // setImpactRating(data.idea.impact || 0);
          // setFeasibilityRating(data.idea.feasibility || 0);
        } catch (error) {
          console.error("Failed to fetch idea:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIdea();
    }
  }, [id]);

  // const handleVote = async () => {
  //   // Implement voting logic here
  //   console.log("Voting for idea:", id, "Impact:", impactRating, "Feasibility:", feasibilityRating);
  //   try {
  //     const res = await fetch("/api/updateIdeaVote", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ideaId: id,
  //         impact: impactRating,
  //         feasibility: feasibilityRating,
  //       }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       // Update idea state or show a toast
  //       console.log("Vote successful!");
  //     } else {
  //       console.error("Vote failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during voting:", error);
  //   }
  // };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Separator className="my-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto p-4 max-w-3xl text-center">
        <h1 className="text-2xl font-bold">Idea Not Found</h1>
        <p className="text-gray-500">The idea you are looking for does not exist.</p>
      </div>
    );
  }

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container>

    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{idea.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={idea.creator?.username || "Creator"} />
              <AvatarFallback>{idea.creator?.username ? idea.creator.username[0] : "U"}</AvatarFallback>
            </Avatar>
            <span className="text-gray-600">By {idea.creator?.username || "Anonymous"} on {formattedDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-6">{idea.description}</p>

          <Separator className="my-6" />

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Rate this Idea:</h3>
            <StarRating
              label="Impact"
              value={impactRating}
              onChange={setImpactRating}
              />
            <StarRating
              label="Feasibility"
              value={feasibilityRating}
              onChange={setFeasibilityRating}
              />
            <button
              // onClick={handleVote}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
              Submit Vote
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
              </Container>
  );
}
