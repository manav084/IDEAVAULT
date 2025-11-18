import dbConnect from "@/lib/mongoose";

import Idea from "@/models/Idea";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req,{params}){

try {

    const {id} = await params
    
    await dbConnect()
    const data = await Idea.findById(id)
      .populate("createdBy", "username name")
      .populate("comments.createdBy", "username name");

    return NextResponse.json({success:true,message:"Idea fetched succesfully",data})

} catch (error) {
    
    return NextResponse.json({success:false,message:"Idea not fetched:"+error.message})

}
}