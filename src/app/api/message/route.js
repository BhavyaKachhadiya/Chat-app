import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import Message from '@/app/models/Message';

// GET Request
export async function GET(request) {
  await connectToDatabase();

  try {
    const messages = await Message.find({});
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST Request
export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const message = await Message.create(body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
