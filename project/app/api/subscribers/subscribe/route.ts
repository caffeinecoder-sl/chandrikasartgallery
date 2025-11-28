import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber } from '@/lib/models';
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const subscriber = new EmailSubscriber({ email });
    await subscriber.save();

    // Send welcome email
    try {
      const emailTemplate = getWelcomeEmailTemplate(email);
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error('Welcome email send failed:', emailError);
      // Continue even if email fails - subscriber is already created
    }

    return NextResponse.json(
      { message: 'Thank you for subscribing!' },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
