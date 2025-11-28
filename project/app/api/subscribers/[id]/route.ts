import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber } from '@/lib/models';

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = context.params;

    const result = await EmailSubscriber.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = context.params;
    const body = await req.json();

    const subscriber = await EmailSubscriber.findByIdAndUpdate(
      id,
      { isActive: body.isActive },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json(subscriber);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}
