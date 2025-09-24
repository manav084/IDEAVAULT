import dbConnect from "@/lib/mongoose";

import Idea from "@/models/Idea";
import { NextResponse } from "next/server";

export async function POST(req,res){
    try {
        const {title,description,category,tags,votes} = await req.json()


        await dbConnect()
        const idea = await Idea.create({title,description,category,tags,votes})

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