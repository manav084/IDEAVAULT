"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Edit, Trash, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const IdeaCard = ({ idea, showButtons, onEdit, onDelete }) => {
  const router = useRouter();
  const { user } = useAuth();

  // Use a local state for the idea object to make it mutable
  const [localIdea, setLocalIdea] = useState(idea);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    // When the component mounts or the user/idea prop changes, update the vote status
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: localIdea._id,
          change: change,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the local state with the fresh idea data from the API
        setLocalIdea(result.data);
      } else {
        console.error("Failed to update vote");
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleTitleClick = () => {
    router.push(`/ideas/${localIdea._id}`);
  };

  // Ensure we have an idea to render
  if (!localIdea) return null;

  return (
    <Card>
      <CardHeader
        className={" cursor-pointer text-3xl"}
        onClick={handleTitleClick}
      >
        <CardTitle>{localIdea.title}</CardTitle>
        <p className="text-sm text-gray-500">
          by {localIdea.createdBy?.name || localIdea.createdBy?.username}
        </p>
      </CardHeader>
      <CardContent>
        <p className="truncate">{localIdea.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5" />
            <span>{localIdea.commentCount || 0}</span>
          </div>
          <p className="text-lg font-bold">Votes: {localIdea.likes - localIdea.dislikes}</p>
        </div>
        <div className="flex gap-2">
          {!showButtons && (
            <>
              <Button
                onClick={() => handleVote("plus")}
                variant="outline"
                disabled={!user}
                className={userVote === 'plus' ? 'text-blue-500 border-blue-500' : ''}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleVote("minus")}
                variant="outline"
                disabled={!user}
                className={userVote === 'minus' ? 'text-red-500 border-red-500' : ''}
              >
                <ThumbsDown className="h-5 w-5" />
              </Button>
            </>
          )}
          {showButtons && (
            <>
              <Button variant="outline" onClick={() => onEdit(localIdea._id)}>
                <Edit />
              </Button>
              <Button variant="outline" onClick={() => onDelete(localIdea._id)}>
                <Trash />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;