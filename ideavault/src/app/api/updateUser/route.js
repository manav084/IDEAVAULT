import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req,res) {
    try{
    await dbConnect()
     const {name, email, passwordHash,role, badges , id} = await req.json();
    const user = await User.findByIdAndUpdate(id , {name, email , passwordHash, role, badges})

       return NextResponse.json({
              success: true,
              data: user,
              message: "User Data is updated successfully!"
        })

    } catch(error) {
        console.error(error)
         return NextResponse.json({
        success: false,
              
              message: "User Data is not  updated !!! "
         })
    }
    
}