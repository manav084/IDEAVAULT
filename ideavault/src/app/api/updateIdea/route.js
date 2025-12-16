import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";
import { ideaSchema } from "@/lib/validation";


export async function PUT(req,res) {


    try {
        const body = await req.json()
        const {title,description,category,tags,id} = ideaSchema.parse(body)
        await dbConnect()

        const idea = await Idea.findByIdAndUpdate(id, {title,description,category,tags})

        return NextResponse.json({
            success:true,
            data:idea,
            message:"Updated Idea"
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
                    message:"Idea cant be updated"
                })
        
    }
    
}