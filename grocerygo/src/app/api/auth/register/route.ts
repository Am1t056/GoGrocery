import connectDb from '@/lib/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        {
          message: 'Email already exists!',
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: 'Password must be at least 6 characters',
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        data: user,
        message: 'User created successfully!',
      },
      { status: 200 },
    );
  } catch (error) {
      return NextResponse.json(
        {
          message: `Register api error ${error}`,
        },
        {
          status: 500,
        },
      );
  }
}
