import { auth } from '@/auth';
import connectDb from '@/lib/db';
import Grocery from '@/models/grocery.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        {
          message: 'Permission not allowed, Your are not admin!',
        },
        { status: 400 },
      );
    }

    const { groceryId } = await req.json();

    if (!groceryId) {
      return NextResponse.json(
        {
          message: 'Grocery id is required',
        },
        { status: 400 },
      );
    }

    const grocery = await Grocery.findById(groceryId);
    if (!grocery) {
      return NextResponse.json(
        {
          message: 'Grocery not found with this id',
        },
        { status: 404 },
      );
    }
    await Grocery.findByIdAndDelete(groceryId);
    return NextResponse.json(
      {
        message: 'Grocery deleted successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Admin API delete grocery failed', error);
    return NextResponse.json(
      {
        message: `Internal Server error: ${error}`,
      },
      { status: 500 },
    );
  }
}
