import dbConnect from "@/lib/mongoose";

import Idea from "@/models/Idea";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function POST(req,res){
    try {

        const cookieStore = await cookies()        
        const userToken = cookieStore.get('token').value

        const {payload} = await jose.jwtVerify(userToken,secret)
        console.log(payload)
        const {title,description,category,tags} = await req.json()

        await dbConnect()

        const idea = await Idea.create({title,description,category,tags,createdBy:payload.userId})

        return NextResponse.json({
            success: true,
            data: idea,
            message:"Idea Created"
        })




    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            success:false,
            message:"Idea not created"
        })
    }
}