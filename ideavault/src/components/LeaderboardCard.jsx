"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const LeaderboardCard = ({ idea, rank }) => {
  const router = useRouter();
  const score = (idea.likes || 0) - (idea.dislikes || 0);

  const handleCardClick = () => {
    router.push(`/ideas/${idea._id}`);
  };

  return (
    <Card
      className="w-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex-grow">
          <Badge variant="outline" className="mb-2">
            {idea.category}
          </Badge>
          <CardTitle className="text-xl font-bold leading-snug">
            {idea.title}
          </CardTitle>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
            #{rank}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-lg">{score} Points</span>
          </div>
          <span className="text-xs">
            By @{idea.createdBy?.username || "Anonymous"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
