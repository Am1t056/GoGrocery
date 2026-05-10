import { auth } from '@/auth';
import connectDb from '@/lib/db';
import emitSocketEventHandler from '@/lib/emitSocketEventHandler';
import DeliveryAssignment from '@/models/deliveryAssignment.model';
import Order from '@/models/order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest,context: { params: Promise<{ id: string; }>;}) {
  try {
    await connectDb();
    const { id } = await context.params;

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        {
          message: 'Assignment not found',
        },
        { status: 404 },
      );
    }

    if (assignment.status !== 'broadcasted') {
      return NextResponse.json(
        {
          message: 'assignment expired',
        },
        { status: 400 }
      );
    }

    const alreadyAssigned=await DeliveryAssignment.findOne({
        assignedTo:deliveryBoyId,
        status: {$nin:["broadcasted","completed"]}
    })

    if(alreadyAssigned){
        return NextResponse.json(
        {
          message: 'You are already assigned!',
        },
        { status: 400 }
      )}

      assignment.assignedTo=deliveryBoyId;
      assignment.status="assigned";
      assignment.acceptedAt=new Date();

      await assignment.save();

      const order=await Order.findById(assignment.order);
      if(!order){
        return NextResponse.json({
            message: "Order not found"
        },{status: 404})
      }

      order.assignedDeliveryBoy=deliveryBoyId;

      await order.save();

      await order.populate("assignedDeliveryBoy")

      await emitSocketEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})


      await DeliveryAssignment.updateMany({_id:{$ne: assignment._id},broadcastedTo:deliveryBoyId,status:"broadcasted"},{
        $pull:{broadcastedTo:deliveryBoyId}
      })

      return NextResponse.json({
        message: "Order accepted successfully"
      },{status:200})






  } catch (error) {
    console.log("Delivery accept assignment api error",error)
       return NextResponse.json({
        message: `Internal Server Error: ${error}`
      },{status:500})

  }
}
