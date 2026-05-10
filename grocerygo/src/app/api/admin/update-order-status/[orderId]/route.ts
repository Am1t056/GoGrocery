import connectDb from '@/lib/db';
import emitSocketEventHandler from '@/lib/emitSocketEventHandler';
import DeliveryAssignment from '@/models/deliveryAssignment.model';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
 context: { params: Promise<{ orderId: string; }>; },
) {
  try {
    await connectDb();
    const { orderId } = await context.params;
    const { status } = await req.json();

    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return NextResponse.json(
        {
          message: 'Order not found!',
        },
        { status: 404 },
      );
    }

    order.status = status;

    let deliveryBoysPayload: any = [];

    if (status === 'out of delivery' && !order.deliveryAssignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await User.find({
        role: 'deliveryBoy',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000, //10 km
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map(
        (deliveryBoy) => deliveryBoy._id,
      );

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ['broadcasted', 'completed'] },
      }).distinct('assignedTo');

      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (deliveryBoy) => !busyIdSet.has(String(deliveryBoy._id)),
      );

      const candidates = availableDeliveryBoys.map(
        (deliveryBoy) => deliveryBoy._id,
      );
      if (candidates.length === 0) {
        await order.save();

        await emitSocketEventHandler('order-status-update', {
          orderId: order._id,
          status: order.status,
        });

        return NextResponse.json(
          {
            message: 'No delivery boys found at the moment!',
          },
          { status: 200 },
        );
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: 'broadcasted',
      });

      // console.log('nearByDeliveryBoys', nearByDeliveryBoys.length);
      // console.log('busyIds', busyIds.length);
      // console.log('availableDeliveryBoys', availableDeliveryBoys.length);
      // console.log('candidates', candidates.length);

      await deliveryAssignment.populate('order');
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          await emitSocketEventHandler(
            'new-assignment',
            deliveryAssignment,
            boy.socketId,
          );
        }
      }

      order.deliveryAssignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((deliveryBoy) => ({
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        mobile: deliveryBoy.mobile,
        latitude: deliveryBoy.location.coordinates[1],
        longitude: deliveryBoy.location.coordinates[0],
      }));
      await deliveryAssignment.populate('order');
    }

    await order.save();
    await order.populate('user');

    await emitSocketEventHandler('order-status-update', {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      {
        deliveryAssignment: order.deliveryAssignment?._id,
        availableDeliveryBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Admin Update order status api failed', error);
    return NextResponse.json(
      {
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
