import connectDb from '@/lib/db';
import emitSocketEventHandler from '@/lib/emitSocketEventHandler';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, totalAmount, paymentMethod, address } =
      await req.json();

    if (!userId || !items || !totalAmount || !paymentMethod || !address) {
      return NextResponse.json(
        {
          message: 'All fields are required!',
        },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found!',
        },
        { status: 404 },
      );
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await emitSocketEventHandler("new-order",newOrder)

    return NextResponse.json(
      {
        newOrder,
        message: 'Order created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `User Order Api Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
