"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const LeaderboardPage = () => {
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const respData = await fetch("/api/admin/getIdeas");
        const parsedData = await respData.json();
        const sortedIdeas = (parsedData.data || []).sort(
          (a, b) => (b.likes || 0) - (a.likes || 0)
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

  const categories = useMemo(() => {
    const allCategories = ideas.map((idea) => idea.category);
    return ["All", ...new Set(allCategories)];
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    if (selectedCategory === "All") {
      return ideas;
    }
    return ideas.filter((idea) => idea.category === selectedCategory);
  }, [ideas, selectedCategory]);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-yellow-900";
      case 2:
        return "bg-gray-300 text-gray-800";
      case 3:
        return "bg-yellow-600 text-yellow-100";
      default:
        return "bg-gray-200 dark:bg-gray-700";
    }
  };

  return (
    <Container>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-8 overflow-hidden">
          <div className=" p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="h-12 w-12 text-yellow-400" />
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight">
                    Leaderboard
                  </h1>
                  <p className="/80 mt-1">
                    Discover the most popular ideas from the community.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/ideas/new")}
                variant="secondary"
              >
                Add Your Idea
              </Button>
            </div>
          </div>
        </Card>

        {/* Filter Chips */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <p className="font-semibold mr-2">Filter by category:</p>
          {loading ? (
            <>
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </>
          ) : (
            categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))
          )}
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredIdeas.length > 0 ? (
          <div className="space-y-4">
            {filteredIdeas.map((idea, index) => (
              <Card
                key={idea._id}
                className="hover:border-primary transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/ideas/${idea._id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl ${getRankColor(
                      index + 1
                    )}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                    {/* Idea Info */}
                    <div className="sm:col-span-2">
                      <h3 className="font-bold text-lg">{idea.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${idea.creator?.username}`}
                          />
                          <AvatarFallback>
                            {idea.creator?.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{idea.creator?.username || "Anonymous"}</span>
                        <Badge variant="outline">{idea.category}</Badge>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-end gap-6 text-sm">
                      <div className="flex items-center gap-1 font-semibold">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>{idea.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span>{idea.dislikes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>{idea.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                No Ideas Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                There are no ideas in this category yet.
              </p>
              {selectedCategory !== "All" && (
                <Button
                  variant="link"
                  onClick={() => setSelectedCategory("All")}
                  className="mt-2"
                >
                  View all categories
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default LeaderboardPage;
