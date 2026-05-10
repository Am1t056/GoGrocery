import connectDb from '@/lib/db';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, socketId } = await req.json();

    if (!userId || !socketId) {
      return NextResponse.json(
        { message: 'userId and socketId are required.' },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { socketId, isOnline: true },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found!' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Socket connect API error:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
