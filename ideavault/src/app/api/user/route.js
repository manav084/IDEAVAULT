import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId;

    await dbConnect();
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET USER API ERROR", error);
    if (error.code === 'ERR_JWS_INVALID') {
        return NextResponse.json({
            success: false,
            message: "Invalid token",
          }, { status: 401 });
    }
    return NextResponse.json({
      success: false,
      message: "Failed to get user data",
    }, { status: 500 });
  }
}
