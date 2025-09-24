import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";


export async function PUT(req,res) {


    try {
        const {title,description,category,tags,votes,id} = await req.json()
        await dbConnect()

        const idea = await Idea.findByIdAndUpdate(id, {title,description,category,tags,votes})

        return NextResponse.json({
            success:true,
            data:idea,
            message:"Updated Idea"
        })
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
                    success:false,
                    message:"Idea cant be updated"
                })
        
    }
    
}