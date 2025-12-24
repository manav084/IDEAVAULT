"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { LinearProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

const DashboardIdeaCard = ({ idea }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [localIdea, setLocalIdea] = useState(idea);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (user && localIdea) {
      if (localIdea.likedBy.includes(user._id)) {
        setUserVote('plus');
      } else if (localIdea.dislikedBy.includes(user._id)) {
        setUserVote('minus');
      } else {
        setUserVote(null);
      }
    } else {
        setUserVote(null);
    }
  }, [localIdea, user]);

  const handleVote = async (change) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: localIdea._id, change: change }),
      });

      if (response.ok) {
        const result = await response.json();
        setLocalIdea(result.data);
      } else {
        console.error("Failed to update vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button")) {
      return;
    }
    router.push(`/ideas/${localIdea._id}`);
  };

  if (!localIdea) return null;

  const totalVotes = localIdea.likes + localIdea.dislikes;
  const likePercentage = totalVotes > 0 ? (localIdea.likes / totalVotes) * 100 : 0;

  const getProgressBackgroundColor = () => {
    if (totalVotes === 0) {
      return theme === 'dark' ? '#FFFFFF' : '#E5E7EB'; // White for dark, light grey for light
    }
    return 'rgba(255, 0, 0, 0.3)'; // Default red
  };


  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md dark:shadow-accent hover:-translate-y-0.5">
      <CardHeader className={"cursor-pointer"} onClick={handleCardClick}>
        <Badge variant="secondary" className="w-fit mb-2">
          {localIdea.category}
        </Badge>
        <CardTitle className="text-xl font-bold leading-snug">
          {localIdea.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          by {localIdea.createdBy?.name || localIdea.createdBy?.username || "Anonymous"}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {localIdea.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
        <div className="w-full">
          <div className="flex justify-between w-full text-sm font-medium mb-1">
            <span className="text-green-600">Likes: {localIdea.likes}</span>
            <span className="text-red-600">Dislikes: {localIdea.dislikes}</span>
          </div>
          <LinearProgress
            variant="determinate"
            value={likePercentage}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: getProgressBackgroundColor(),
              "& .MuiLinearProgress-bar": {
                backgroundColor: totalVotes > 0 ? "#22c55e" : 'transparent', // Green bar, or transparent if no votes
              },
            }}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Score</span>
            <span className="text-2xl font-bold">{localIdea.likes - localIdea.dislikes}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{localIdea.commentCount || 0}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleVote("plus")}
              disabled={!user}
              className={`hover:bg-green-100 dark:hover:bg-green-900 text-green-600 hover:text-green-700 border-green-200 dark:border-green-800 ${userVote === 'plus' ? 'bg-green-200 dark:bg-green-800' : ''}`}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleVote("minus")}
              disabled={!user}
              className={`hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-700 border-red-200 dark:border-red-800 ${userVote === 'minus' ? 'bg-red-200 dark:bg-red-800' : ''}`}
            >
              <ThumbsDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardIdeaCard;