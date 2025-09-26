import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const idea = await Idea.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      data: idea,
      message: "Idea deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,

      message: "Idea not deleted !!! ",
    });
  }
}
