import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail, getOrderConfirmationEmailTemplate } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { product, name, email, message } = body;

    // Validate required fields
    if (!product || !name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Send confirmation email to customer
    try {
      const productPrice = product.price || 0;
      const emailTemplate = getOrderConfirmationEmailTemplate(
        email,
        orderId,
        product.name || product.title,
        productPrice
      );

      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error('Order confirmation email send failed:', emailError);
      // Continue even if email fails
    }

    // Send notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Order Received - ${orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>New Order Notification</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Customer Name:</strong> ${name}</p>
              <p><strong>Customer Email:</strong> ${email}</p>
              <p><strong>Product:</strong> ${product.name || product.title}</p>
              <p><strong>Price:</strong> $${(product.price || 0).toFixed(2)}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          `,
          text: `New Order Notification\n\nOrder ID: ${orderId}\nCustomer: ${name}\nEmail: ${email}\nProduct: ${
            product.name || product.title
          }\nPrice: $${(product.price || 0).toFixed(2)}\n\nMessage:\n${message}`,
        });
      }
    } catch (adminEmailError) {
      console.error('Admin notification email send failed:', adminEmailError);
    }

    return NextResponse.json(
      {
        message: 'Order request received. You will be contacted soon.',
        orderId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit order' },
      { status: 500 }
    );
  }
}
