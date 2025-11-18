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

const DashboardIdeaCard = ({ idea }) => {
  const router = useRouter();
  const [likes, setLikes] = useState(idea.likes || 0);
  const [dislikes, setDislikes] = useState(idea.dislikes || 0);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = likes + dislikes;
  const likePercentage = totalVotes > 0 ? (likes / totalVotes) * 100 : 0;

  const handleVote = async (voteType) => {
    setIsVoting(true);
    try {
      const res = await fetch("/api/updateIdeaVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idea._id, change: voteType }),
      });

      if (res.ok) {
        if (voteType === "plus") {
          setLikes((prev) => prev + 1);
        } else {
          setDislikes((prev) => prev + 1);
        }
      } else {
        console.error("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCardClick = (e) => {
    // Prevent navigation when clicking on buttons
    if (e.target.closest("button")) {
      return;
    }
    router.push(`/ideas/${idea._id}`);
  };

  return (
    <Card
      className="flex flex-col h-full transition-all hover:shadow-md dark:shadow-accent hover:-translate-y-0.5 "
      
    >
      <CardHeader className={"cursor-pointer"} onClick={handleCardClick}>
        <Badge variant="secondary" className="w-fit mb-2">
          {idea.category}
        </Badge>
        <CardTitle className="text-xl font-bold leading-snug">
          {idea.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          by {idea.createdBy?.name || idea.createdBy?.username || "Anonymous"}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {idea.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
        <div className="w-full">
          <div className="flex justify-between w-full text-sm font-medium mb-1">
            <span className="text-green-600">Likes: {likes}</span>
            <span className="text-red-600">Dislikes: {dislikes}</span>
          </div>
          <LinearProgress
            variant="determinate"
            value={likePercentage}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "rgba(255, 0, 0, 0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#22c55e",
              },
            }}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Score</span>
            <span className="text-2xl font-bold">{likes - dislikes}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{idea.commentCount || 0}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleVote("plus")}
              disabled={isVoting}
              className="hover:bg-green-100 dark:hover:bg-green-900 text-green-600 hover:text-green-700 border-green-200 dark:border-green-800"
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleVote("minus")}
              disabled={isVoting}
              className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-700 border-red-200 dark:border-red-800"
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
