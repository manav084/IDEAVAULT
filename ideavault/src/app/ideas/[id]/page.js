"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import Container from "@/components/Container";

const StarRating = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-lg">{label}:</span>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer h-7 w-7 ${
              star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
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
          const res = await fetch(`/api/admin/getIdea/${id}`);
          const data = await res.json();
          setIdea(data.data);
        } catch (error) {
          console.error("Failed to fetch idea:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchIdea();
    }
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="container mx-auto p-4 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full mb-6" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </Container>
    );
  }

  if (!idea) {
    return (
      <Container>
        <div className="container mx-auto p-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold">Idea Not Found</h1>
          <p className="text-gray-500 mt-2">
            The idea you are looking for does not exist or has been removed.
          </p>
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
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 p-6">
            <Badge variant="secondary" className="w-fit mb-2">{idea.category}</Badge>
            <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {idea.title}
            </CardTitle>
            <div className="flex items-center gap-4 pt-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${idea.creator?.username}`}
                  alt={idea.creator?.username}
                />
                <AvatarFallback>
                  {idea.creator?.username ? idea.creator.username[0].toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{idea.creator?.username || "Anonymous"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Published on {formattedDate}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
              {idea.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {idea.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6">
            <div className="w-full">
              <h3 className="text-2xl font-bold mb-4">Rate this Idea</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-col gap-4">
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
                </div>
                <Button size="lg" className="mt-4 md:mt-0">
                  Submit Your Vote
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
