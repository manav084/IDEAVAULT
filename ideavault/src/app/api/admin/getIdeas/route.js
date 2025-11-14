import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await dbConnect()
        const Ideas = await Idea.find({}).populate('createdBy', 'username')
        return NextResponse.json({
            succes:true,
            data:Ideas,
            message:"Fetched Succesfully"
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success:false,
            message:error.message
        })
        
        
    }
    
}