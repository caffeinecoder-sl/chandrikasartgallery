import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber, BlogPost } from '@/lib/models';
import { sendNewsletterBatch } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
    }

    // Get all active subscribers
    const activeSubscribers = await EmailSubscriber.find({ isActive: true });

    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers to send to' },
        { status: 200 }
      );
    }

    // Extract email addresses
    const emailAddresses = activeSubscribers.map((sub) => sub.email);

    // Send newsletter to all subscribers
    const result = await sendNewsletterBatch(emailAddresses, subject, content);

    return NextResponse.json(
      {
        message: `Newsletter sent successfully`,
        sent: result.sent,
        failed: result.failed,
        errors: result.errors,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
