import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signupSchema } from "@/lib/validation"

export async function  POST(req) {
    try{
        const body = await req.json()
        const {username,name, email, password} = signupSchema.parse(body)
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
            await User.create({username,name, email, password:hashedPassword})
            return NextResponse.json({
                success:true,
                message:"User is SignUP successfully!"
                
            },
            {
                status:200
            })
        }catch(err){
            if (err.name === 'ZodError') {
                return NextResponse.json({
                    success: false,
                    message: err.issues.map((issue) => issue.message).join(', ')
                }, {
                    status: 400
                })
            }
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