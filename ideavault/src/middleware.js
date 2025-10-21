import { NextResponse } from "next/server"
import * as jose from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function middleware(req){

    try {
    
    const tokens =  req.cookies.get("token")?.value

    if(!tokens){
       return NextResponse.redirect(new URL("/sample", req.url))
    }
   const {payload} =  await jose.jwtVerify(tokens,secret)
    if(payload.role !== "admin"){
        return NextResponse.json({
                success:false,
                message:"Unauthorised... can't access to Admin panel!"
                
            },
            {
                status:403
            })

    }
     return NextResponse.next()
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

export const config = {matcher:["/admin/*"]}