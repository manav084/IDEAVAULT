"use client";
import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import IdeaList from "@/components/IdeaList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserIdeas = async () => {
    try {
      const res = await fetch("/api/userIdeas");
      const data = await res.json();
      if (data.success) {
        setIdeas(data.data);
        if (data.data.length > 0) {
          setUser(data.data[0].createdBy);
        }
      } else {
        console.error("Failed to fetch user ideas:", data.message);
        toast.error("Failed to fetch your ideas.");
      }
    } catch (error) {
      console.error("Error fetching user ideas:", error);
      toast.error("An error occurred while fetching your ideas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIdeas();
  }, []);

  const handleEdit = (id) => {
    router.push(`/ideas/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this idea?")) {
      try {
        const res = await fetch(`/api/deleteIdea/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Idea deleted successfully!");
          fetchUserIdeas(); // Refresh the list
        } else {
          toast.error(data.message || "Failed to delete idea.");
        }
      } catch (error) {
        console.error("Error deleting idea:", error);
        toast.error("An error occurred while deleting the idea.");
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <Separator />
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">My Ideas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster richColors />
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`}
                />
                <AvatarFallback>
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.username}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Separator />

        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">My Ideas</h2>
          {ideas.length > 0 ? (
            <IdeaList
              routeIdeas={ideas}
              showButtons={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                You haven&apos;t created any ideas yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;