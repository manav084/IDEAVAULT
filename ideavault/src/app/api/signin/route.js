import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import {SignJWT} from "jose"
import { signinSchema } from "@/lib/validation"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)
export async function POST(req){
 try {
     const body = await req.json()
     const {email,password} = signinSchema.parse(body)
     await dbConnect()
     const verifyEmail =  await User.findOne({email})
 
     if(!verifyEmail){
        
        
        return NextResponse.json({
                success:false,
                message:"Email does not exist"
                
            },
            {
                status:403
            })
     }
     const verifyPassword = await bcrypt.compare(password,verifyEmail.password)
        if(!verifyPassword){
             return NextResponse.json({
                success:false,
                message:"Invalid Password"
                
            },
            {
                status:403
            })
        }
        const payload = {
            userId:verifyEmail._id.toString(),
            user: verifyEmail.username,
            role: verifyEmail.role

        }
        const alg = "HS256"
        
       const accessToken = await new SignJWT(payload).setProtectedHeader({alg}).sign(secret)

       const res = NextResponse.json({
        success:true,
         message:"Sign In Successfully!"
       }, {
        status: 201
       })
      res.cookies.set({name:'token',value:accessToken, httpOnly:true}
      )
      return res
 } catch (error) {
    if (error.name === 'ZodError') {
        return NextResponse.json({
            success: false,
            message: error.issues.map((issue) => issue.message).join(', ')
        }, {
            status: 400
        })
    }
    console.error(error)
    return NextResponse.json({
           
                success:false,
                message:error.message
                
            },
            {
                status:403
            })
 }

}