import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await connectDb()

        const groceries=await Grocery.find({})
        return NextResponse.json(groceries,{status:200})
        
    } catch (error) {
        console.log("Admin API get groceries failed",error)
        return NextResponse.json({
            message: `Internal Server error: ${error}`
        },{status:500})
        
    }
}