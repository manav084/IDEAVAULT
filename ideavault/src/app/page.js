"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/ModeToggle";
import { LightbulbIcon, UsersIcon, SearchIcon, ShieldIcon } from "lucide-react";
import { NavigationMenuDemo } from "@/components/Header";

export default function Home() {
  return (
    <div>``
      {/* Hero Section */}
      <main className="pt-10">
        <section className="min-h-screen flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to IdeaVault</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">Store, organize, and collaborate on your ideas securely.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <LightbulbIcon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Idea Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Easily categorize and manage your ideas with intuitive tools.</CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <UsersIcon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Share and collaborate on ideas with your team in real-time.</CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <SearchIcon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Easy Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Quickly find your ideas with powerful search and filters.</CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ShieldIcon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>Secure Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Your ideas are stored securely with top-notch encryption.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
