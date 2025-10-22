"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  
  const [fData, setFData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [err, seterr] = useState("")

  const handleChange = (e) => {
    setFData({ ...fData, [e.target.id]: e.target.value });

  };


  useEffect(() => {
    
  checkPassword()
    
  }, [fData.confirmPassword,fData.password])
  

  const checkPassword = () => { 
    if (fData.confirmPassword && fData.confirmPassword !== fData.password) {
      seterr("Passwords don't match")} 

      else seterr("")
   }

  const handleSubmit =(e) => { 
    e.preventDefault()
    console.log(fData);
        
   }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-background
    p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
          <form onSubmit={handleSubmit}>
        <CardContent >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="name"
                  onChange={handleChange}
                  value={fData.name}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  value={fData.email}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  value={fData.password}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  value={fData.confirmPassword}
                  placeholder="Confirm your password"
                  required
                />
              </div>
           {err && <p className="text-sm text-destructive">{err}</p>}


            </div>
        </CardContent>
        <CardFooter className="justify-center pt-6">
          <Button 
          disabled={err}
          className="w-full" >
            Sign Up
          </Button>
        </CardFooter>
          </form>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
