// import {dbConnect} from '@/lib/mongoose'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User';
import { NextResponse } from 'next/server';
export async function POST(req, res) {
    try{
        const {name, email, passwordHash,role, badges} = await req.json();
        await dbConnect();
        const user = await User.create({name, email, passwordHash, role, badges})

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