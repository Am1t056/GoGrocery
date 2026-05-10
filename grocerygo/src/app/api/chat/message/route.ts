import connectDb from "@/lib/db";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {text,senderId,roomId,time}=await req.json();

        const room=await Order.findById(roomId);
        if(!room){
            return NextResponse.json({
                message: "Chat Room not found!"
            },{status:404})
        }

        const message=await Message.create({
            text,
            senderId,
            roomId,
            time
        })

        return NextResponse.json({
            message
        },{status:200})
        
    } catch (error) {
        console.log('Chat message api error:', error);
            return NextResponse.json(
              {
                message: `Internal Server Error: ${error}`,
              },
              { status: 500 },
            );
    }
}