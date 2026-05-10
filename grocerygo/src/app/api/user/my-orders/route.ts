import { auth } from '@/auth';
import connectDb from '@/lib/db';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    const user = await User.findById(session?.user?.id);
    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found!',
        },
        { status: 404 },
      );
    }

    const orders = await Order.find({ user }).populate('user assignedDeliveryBoy').sort({createdAt: -1});
    if (!orders) {
      return NextResponse.json(
        {
          message: 'Orders not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        orders,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `My orders GET-Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
