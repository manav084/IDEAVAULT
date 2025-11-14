import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('token');

    if (!userToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(userToken.value, secret);
    const userId = payload.userId;

    await dbConnect();

    const ideas = await Idea.find({ createdBy: userId }).populate('createdBy', 'username name');

    return NextResponse.json({
      success: true,
      data: ideas,
      message: "User ideas fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching user ideas:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching user ideas",
      error: error.message
    }, { status: 500 });
  }
}
