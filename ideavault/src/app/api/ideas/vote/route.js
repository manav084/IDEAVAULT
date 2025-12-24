import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { cookies } from "next/headers";
import mongoose from "mongoose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function POST(req,res){
    try {
        await dbConnect()
        const { id, change } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json({
            success: false,
            message: "Invalid idea ID",
          }, { status: 400 });
        }
    
        const idea = await Idea.findById(id);
    
        if (!idea) {
          return NextResponse.json({
            success: false,
            message: "Idea not found",
          }, { status: 404 });
        }
    
        const cookieStore = await cookies();
        const userToken = cookieStore.get("token")?.value;

        if(!userToken){
            return NextResponse.json({
                success: false,
                message: "User not logged in",
              }, { status: 401 });
        }

        const { payload } = await jose.jwtVerify(userToken, secret);
        const userId = payload.userId;
    
        const likedByUser = idea.likedBy.includes(userId);
        const dislikedByUser = idea.dislikedBy.includes(userId);
    
        if (change === "plus") { // Corresponds to 'like'
          if (likedByUser) {
            idea.likes -= 1;
            idea.likedBy = idea.likedBy.filter((uid) => uid.toString() !== userId);
          } else {
            idea.likes += 1;
            idea.likedBy.push(userId);
            if (dislikedByUser) {
              idea.dislikes -= 1;
              idea.dislikedBy = idea.dislikedBy.filter((uid) => uid.toString() !== userId);
            }
          }
        } else if (change === "minus") { // Corresponds to 'dislike'
          if (dislikedByUser) {
            idea.dislikes -= 1;
            idea.dislikedBy = idea.dislikedBy.filter((uid) => uid.toString() !== userId);
          } else {
            idea.dislikes += 1;
            idea.dislikedBy.push(userId);
            if (likedByUser) {
              idea.likes -= 1;
              idea.likedBy = idea.likedBy.filter((uid) => uid.toString() !== userId);
            }
          }
        } else {
          return NextResponse.json({
            success: false,
            message: "Invalid vote type",
          }, { status: 400 });
        }
    
        await idea.save();
    
        return NextResponse.json({
          success: true,
          data: idea,
          message: "Vote updated successfully",
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success:false,
            message:"Idea not created"
        })
    }
}
