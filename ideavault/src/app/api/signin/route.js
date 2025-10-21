import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
import {SignJWT} from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)
export async function POST(req){
 try {
     const {email,password} = await req.json()
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