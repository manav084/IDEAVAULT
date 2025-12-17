"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardIdeaCard from "@/components/DashboardIdeaCard";
import { PlusCircle } from "lucide-react";

const IdeasPage = () => {
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respData = await fetch("/api/admin/getIdeas");
        const parsedData = await respData.json();
        // Sort by most recently created
        const sortedIdeas = (parsedData.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
            <h1 className="text-4xl font-extrabold tracking-tight">
              Ideas Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse, vote, and contribute to the community&#39;s ideas.
            </p>
          </div>
          <Button onClick={() => router.push("/ideas/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Idea
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-56 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ideas.map((idea) => (
              <DashboardIdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No Ideas Yet</h2>
            <p className="text-gray-500 mt-2">
              Be the first to share an amazing idea with the community!
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
