import dbConnect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";

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

    const { ideaId, text } = await req.json();

    if (!ideaId || !text) {
      return NextResponse.json({ success: false, message: "Idea ID and comment text are required" }, { status: 400 });
    }

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
    console.error("Error adding comment:", error);
    return NextResponse.json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    }, { status: 500 });
  }
}
