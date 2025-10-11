// import {dbConnect} from '@/lib/mongoose'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User';
import { NextResponse } from 'next/server';
export async function POST(req, res) {
    try{
        const {username,name, email, password} = await req.json();
        await dbConnect();
        const user = await User.create({username,name, email, password})

        return NextResponse.json({
            success:true,
            data:user,
            message: " User is Created Successfully!"
        })

    }catch(error){
        console.error(error)

        return NextResponse.json({
            success:false,
            message: "User is not Created!"
        })
    }
}