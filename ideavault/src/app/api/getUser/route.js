// import dbConnect from '@/lib/mongoose'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

import { NextResponse } from 'next/server'

export async function GET(req, res) {
    try{
        await dbConnect()
        const user = await User.find({})

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: " User Data is Fetched"
            }
        )
    }catch(error){
    console.error(error)
    return NextResponse.json({
        success:false,
        message: "User Data is not Fetched!"
    })
}
    
}