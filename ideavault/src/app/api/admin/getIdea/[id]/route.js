import dbConnect from "@/lib/mongoose";

import Idea from "@/models/Idea";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { idSchema } from "@/lib/validation";

export async function GET(req,{params}){

try {
    const id = idSchema.parse(params.id);
    
    await dbConnect()
    const data = await Idea.findById(id)
      .populate("createdBy", "username name")
      .populate("comments.createdBy", "username name");

    return NextResponse.json({success:true,message:"Idea fetched succesfully",data})

} catch (error) {
    if (error.name === 'ZodError') {
        return NextResponse.json({
            success: false,
            message: error.issues.map((issue) => issue.message).join(', ')
        }, {
            status: 400
        })
    }
    return NextResponse.json({success:false,message:"Idea not fetched:"+error.message})

}
}