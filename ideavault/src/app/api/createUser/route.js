import dbConnect from '@/lib/mongoose'
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validation';
export async function POST(req, res) {
    try{
        const body = await req.json();
        const {username,name, email, password} = signupSchema.parse(body)
        await dbConnect();
        const user = await User.create({username,name, email, password})

        return NextResponse.json({
            success:true,
            data:user,
            message: " User is Created Successfully!"
        })

    }catch(error){
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
            message: "User is not Created!"
        })
    }
}