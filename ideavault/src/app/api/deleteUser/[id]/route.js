import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function  DELETE(req, {params}) {
    try{
        await dbConnect()
        const {id} = params;

        const user = await User.findByIdAndDelete(id)

        return NextResponse.json({
              success: true,
              data: user,
              message: "User Data is deleted successfully!"
        })

    } catch(error) {
        console.error(error)
         return NextResponse.json({
        success: false,
              
              message: "User Data is not  deleted !!! "
         })
    }

}