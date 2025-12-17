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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [fData, setFData] = useState({
    name: "",
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [err, setErr] = useState("")

  const handleChange = (e) => {
    setFData({ ...fData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const checkPassword = () => { 
      if (fData.confirmPassword && fData.confirmPassword !== fData.password) {
        setErr("Passwords don't match")} 
      else setErr("")
    }
    checkPassword()
  }, [fData.confirmPassword,fData.password]);

  const  handleSubmit = async (e) => { 
    e.preventDefault()
    if(err){
      return
    }
    try{
      const response =  await fetch(`/api/signup`,{method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify(
          {
          "name":fData.name,
          "username":fData.username,
          "email":fData.email,
          "password":fData.password
          }
      )})
      const data =  await response.json()   
      if(!data.success){
        setErr(data.message)
      } else {
        router.push("/signin")
      }
    }catch(error){
        console.error(error)
        setErr("An unexpected error occurred.")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-background
    p-8"
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
                  placeholder="Manav Pandey"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  type="username"
                  onChange={handleChange}
                  value={fData.username}
                  placeholder="manav_pandey02"
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
                  placeholder="mp@example.com"
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
          disabled={!!err}
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
