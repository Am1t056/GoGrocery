import connectDb from '@/lib/db';
import emitSocketEventHandler from '@/lib/emitSocketEventHandler';
import DeliveryAssignment from '@/models/deliveryAssignment.model';
import Order from '@/models/order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { otp, orderId } = await req.json();
    if (!otp || !orderId) {
      return NextResponse.json(
        {
          message: 'Otp or orderId is required for verification!',
        },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          message: 'Order not found!',
        },
        { status: 404 },
      );
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        {
          message: 'Incorrect or expired Otp',
        },
        { status: 400 },
      );
    }

    order.status = 'delivered';
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();

    await order.save();

         await emitSocketEventHandler('order-status-update', {
              orderId: order._id,
              status: order.status,
            });

    await DeliveryAssignment.updateOne(
      {
        order: orderId,
      },
      { $set: { assignedTo: null, status: 'completed' } },
    );

    return NextResponse.json(
      {
        message: 'Delivery successfully completed',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Failed to verify otp', error);
    return NextResponse.json(
      {
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
