import dbConnect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import { commentSchema } from "@/lib/validation";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('token');

    if (!userToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(userToken.value, secret);
    const userId = payload.userId;

    const body = await req.json();
    const { ideaId, text } = commentSchema.parse(body);

    await dbConnect();

    const newComment = await Comment.create({
      text,
      createdBy: userId,
      idea: ideaId,
    });

    const populatedComment = await Comment.findById(newComment._id).populate(
      "createdBy",
      "username name"
    );

    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
      data: populatedComment,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
        return NextResponse.json({
            success: false,
            message: error.issues.map((issue) => issue.message).join(', ')
        }, {
            status: 400
        })
    }
    console.error("Error adding comment:", error);
    return NextResponse.json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    }, { status: 500 });
  }
}
