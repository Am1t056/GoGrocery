import { auth } from '@/auth';
import connectDb from '@/lib/db';
import DeliveryAssignment from '@/models/deliveryAssignment.model';
import { NextRequest, NextResponse } from 'next/server';
import "@/models/order.model"


export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session?.user?.id,
      status: 'broadcasted',
    }).populate("order");
    // if (!assignments || assignments.length === 0) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         'Delivery Assignments for this user with status broadcasted not found',
    //     },
    //     { status: 404 },
    //   );
    // }

    return NextResponse.json(
      {
        assignments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Delivery get-assignments api failed', error);
    return NextResponse.json(
      {
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
