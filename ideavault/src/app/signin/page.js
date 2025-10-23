"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SignInPage() {
  
  const [fData, setfData] = useState({email:"",password:""})

  const handleChange = (e) => { setfData({...fData,[e.target.id]:e.target.value}) }
  const handleSubmit = async (e) => { 
    e.preventDefault()
    console.log(fData)
     try{

    const response =  await fetch(`/api/signin`,{method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify(
        {
  
        "email":fData.email,
        "password":fData.password
        }
        
    )})
    const data =  await response.json()   
    console.log(data);
    
  }catch(error){
      console.error(error)
      console.log(error);
      
  }
  
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" onChange={handleChange} required />
            </div>
          </div>
      </CardContent>
        <CardFooter className="justify-center pt-6">
          <Button className="w-full">Sign In</Button>
        </CardFooter>
        </form>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}