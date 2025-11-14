"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import LeaderboardCard from "@/components/LeaderboardCard";
import { Trophy } from "lucide-react";

const IdeasPage = () => {
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respData = await fetch("/api/admin/getIdeas");
        const parsedData = await respData.json();
        const sortedIdeas = (parsedData.data || []).sort(
          (a, b) => (b.likes || 0) - (b.dislikes || 0) - ((a.likes || 0) - (a.dislikes || 0))
        );
        setIdeas(sortedIdeas);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Top ideas ranked by the community.
            </p>
          </div>
          <Button onClick={() => router.push("/ideas/new")}>
            Add New Idea
          </Button>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.map((idea, index) => (
              <LeaderboardCard key={idea._id} idea={idea} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No Ideas Yet</h2>
            <p className="text-gray-500 mt-2">
              Be the first to share an amazing idea and get on the leaderboard!
            </p>
            <Button onClick={() => router.push("/ideas/new")} className="mt-6">
              Create an Idea
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default IdeasPage;
