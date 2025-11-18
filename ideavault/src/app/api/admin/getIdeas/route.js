import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const ideas = await Idea.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "idea",
                    as: "comments",
                },
            },
            {
                $addFields: {
                    commentCount: { $size: "$comments" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy",
                },
            },
            {
                $unwind: "$createdBy",
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    category: 1,
                    tags: 1,
                    likes: 1,
                    dislikes: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentCount: 1,
                    "createdBy.username": 1,
                    "createdBy.name": 1,
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: ideas,
            message: "Fetched Successfully"
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
}