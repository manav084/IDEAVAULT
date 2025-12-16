import dbConnect from "@/lib/mongoose";

import Idea from "@/models/Idea";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { cookies } from "next/headers";
import { ideaSchema } from "@/lib/validation";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function POST(req,res){
    try {

        const cookieStore = await cookies()        
        const userToken = cookieStore.get('token').value


        const {payload} = await jose.jwtVerify(userToken,secret)
        console.log(payload)
        const body = await req.json()
        const {title,description,category,tags} = ideaSchema.parse(body)

        await dbConnect()

        const idea = await Idea.create({title,description,category,tags,createdBy:payload.userId})

        return NextResponse.json({
            success: true,
            data: idea,
            message:"Idea Created"
        })




    } catch (error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({
                success: false,
                message: error.errors[0].message
            }, {
                status: 400
            })
        }
        console.log(error);
        
        return NextResponse.json({
            success:false,
            message:"Idea not created"
        })
    }
}