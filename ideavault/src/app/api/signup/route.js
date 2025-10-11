import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
export async function  POST(req) {
    const {username,name, email, password} = await req.json()
    await dbConnect()
     const verifyUser = await User.findOne({email})
     if(verifyUser){
        return NextResponse.json({
            success:false,
            message:"Email already exists!"

        },
        {
            status:403
        })
     }
     const saltNumber = 10
     const hashedPassword = await bcrypt.hash(password,saltNumber)
    fetch(`/api/createUser`,{method:"POST",
        headers: {
        "Content-Type": "application/json"},
        body: JSON.stringify({username,name, email, password:hashedPassword})
    }).then((data)=>data.json()).then((parseData)=>console.log(parseData.message))
            return NextResponse.json({
            success:true,
            message:"User is SignUP successfully!"

        },
        {
            status:200
        })
}