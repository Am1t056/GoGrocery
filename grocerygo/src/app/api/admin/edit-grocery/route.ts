import { auth } from '@/auth';
import uploadOnCloudinary from '@/lib/cloudinary';
import connectDb from '@/lib/db';
import Grocery from '@/models/grocery.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // returned by next-auth
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        {
          message: 'Permission not allowed, Your are not admin!',
        },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const groceryId = formData.get('groceryId') as string;
    const category = formData.get('category') as string;
    const unit = formData.get('unit') as string;
    const price = formData.get('price') as string;
    const file = formData.get('image') as Blob | null;

     if (!name || !category || !unit || !price) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 },
      );
    }

    if (!file) {
      return NextResponse.json(
        { message: 'Image is required' },
        { status: 400 },
      );
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId,{
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        grocery:grocery,
        message: 'Grocery created successfully',
      },
      { status: 200 },
    );
  } catch (error) {
   console.error('Add grocery error:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : String(error), // ← shows exact reason
      },
      { status: 500 },
    );
  }
}
