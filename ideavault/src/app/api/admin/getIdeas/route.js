import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";


export async function GET(req,res) {
    try {
        await dbConnect()
        const Ideas = await Idea.find({})
        return NextResponse.json({
            succes:true,
            data:Ideas,
            message:"Fetched Succesfully"
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success:false,
            message:"Cant"
        })
        
        
    }
    
}