"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const IdeaCard = ({ idea, showButtons, onEdit, onDelete }) => {
  const router = useRouter();
  const [voteObj, setvoteObj] = useState({ likes: 0, dislikes: 0 });

  const voteUpdate = async (id, change) => {
    try {
      const updatedData = await fetch("/api/updateIdeaVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, change }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleVoteChange = (id, change) => {
    voteUpdate(id, change);
    setvoteObj({
      ...voteObj,
      [change === "plus" ? "likes" : "dislikes"]:
        change === "plus" ? voteObj.likes + 1 : voteObj.dislikes + 1,
    });
  };

  useEffect(() => {
    setvoteObj({ likes: idea.likes, dislikes: idea.dislikes });
  }, [idea]);

  const handleTitleClick = () => {
    router.push(`/ideas/${idea._id}`);
  };

  return (
    <Card>
      <CardHeader
        className={" cursor-pointer text-3xl"}
        onClick={handleTitleClick}
      >
        <CardTitle>{idea.title}</CardTitle>
        <CardTitle>{idea.createdBy?.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{idea.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-lg font-bold">
            Votes: {voteObj.likes - voteObj.dislikes}
          </p>
        </div>
        <div className="flex gap-2">
          {!showButtons && (
            <>
              <Button
                onClick={() => handleVoteChange(idea._id, "plus")}
                variant="outline"
              >
                <ArrowUp />
              </Button>
              <Button
                onClick={() => handleVoteChange(idea._id, "minus")}
                variant="outline"
              >
                <ArrowDown />
              </Button>
            </>
          )}
          {showButtons && (
            <>
              <Button variant="outline" onClick={() => onEdit(idea._id)}>
                <Edit />
              </Button>
              <Button variant="outline" onClick={() => onDelete(idea._id)}>
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
