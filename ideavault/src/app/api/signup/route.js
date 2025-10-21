import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function  POST(req) {
    try{

        const {username,name, email, password} = await req.json()
        await dbConnect()
        const verifyUser = await User.findOne({email})
        if(verifyUser){
            return NextResponse.json({
                success:false,
                message:"Email already exists!"
                
            },
            {
                status:403
            })
        }
        const saltNumber = 10
        const hashedPassword = await bcrypt.hash(password,saltNumber)
        // fetch(`/api/createUser`,{method:"POST",
        //     headers: {
            //     "Content-Type": "application/json"},
            //     body: JSON.stringify({username,name, email, password:hashedPassword})
            // }).then((data)=>data.json()).then((parseData)=>console.log(parseData.message))
            await User.create({username,name, email, password:hashedPassword})
            return NextResponse.json({
                success:true,
                message:"User is SignUP successfully!"
                
            },
            {
                status:200
            })
        }catch(err){
            console.error(err)
             return NextResponse.json({
                success:false,
                message: err.message
                
            },
            {
                status:501
            })
        }
        }