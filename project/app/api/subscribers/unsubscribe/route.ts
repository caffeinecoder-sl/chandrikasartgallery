import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const subscriber = await EmailSubscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json({ error: 'Invalid unsubscribe token' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
