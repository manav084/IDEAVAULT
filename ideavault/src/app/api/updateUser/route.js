import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { updateUserSchema } from "@/lib/validation";

export async function PUT(req,res) {
    try{
        const body = await req.json();
        const {name, email, passwordHash,role, badges , id} = updateUserSchema.parse(body)
    await dbConnect()
    const user = await User.findByIdAndUpdate(id , {name, email , passwordHash, role, badges})

       return NextResponse.json({
              success: true,
              data: user,
              message: "User Data is updated successfully!"
        })

    } catch(error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({
                success: false,
                message: error.errors[0].message
            }, {
                status: 400
            })
        }
        console.error(error)
         return NextResponse.json({
        success: false,
              
              message: "User Data is not  updated !!! "
         })
    }
    
}