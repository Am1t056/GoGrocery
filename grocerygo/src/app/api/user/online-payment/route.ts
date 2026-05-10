import connectDb from '@/lib/db';
import Order from '@/models/order.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    if (totalAmount < 100) {
      return NextResponse.json(
        {
          message: 'Minimum order amount is 100 NPR',
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: [
        {
          price_data: {
            currency: 'npr',
            product_data: {
              name: 'GroceryGo Order Payment',
            },
            unit_amount: totalAmount * 100, // Amount in cents (e.g., $10.00 = 1000)
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    return NextResponse.json({
        url: session.url
    },{status:200})
  } catch (error) {
    return NextResponse.json({
        message: `Online Payment- Internal Server error ${error}`
    },{status: 500})
  }
}
