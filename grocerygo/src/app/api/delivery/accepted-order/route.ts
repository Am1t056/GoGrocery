import { auth } from '@/auth';
import connectDb from '@/lib/db';
import DeliveryAssignment from '@/models/deliveryAssignment.model';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    const user = await User.findById(session?.user?.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: user._id,
      status: 'assigned',
    })
      .populate({
        path: 'order',

        populate: {
          path: 'address',
        },
      })
      .lean();

    if (!activeAssignment) {
      return NextResponse.json(
        {
          message: 'No active assignment found!',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        active: true,
        assignment: activeAssignment,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Delivery accepted-order api failure', error);
    return NextResponse.json(
      {
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
