import dbConnect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { ideaId } = params;

    await dbConnect();

    const comments = await Comment.find({ idea: ideaId })
      .populate("createdBy", "username name")
      .sort({ createdAt: "desc" });

    return NextResponse.json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching comments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
