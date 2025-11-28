import nodemailer from 'nodemailer';

// Initialize transporter
let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@example.com';
  const fromName = process.env.SMTP_FROM_NAME || 'Art Platform';

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is missing. Please check your environment variables.');
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

// Email template types
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email function
export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = getEmailTransporter();
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@example.com';
    const fromName = process.env.SMTP_FROM_NAME || 'Art Platform';

    const result = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

// Email template utilities
export function getWelcomeEmailTemplate(email: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Welcome to Our Art Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for subscribing to our newsletter</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Thank you for joining our community! You'll now receive weekly updates about:
          </p>
          <ul style="color: #666; font-size: 14px; line-height: 1.8;">
            <li>🎨 New artworks and gallery updates</li>
            <li>📝 Blog posts and artistic insights</li>
            <li>🛍️ Exclusive shop previews and offers</li>
            <li>💡 Behind-the-scenes creative content</li>
          </ul>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            If you ever want to unsubscribe or update your preferences, you can do so anytime from the footer of any email we send you.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            <strong>The Art Platform Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2024 Art Platform. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Welcome to Our Art Platform!

Thank you for joining our community! You'll now receive weekly updates about:
- New artworks and gallery updates
- Blog posts and artistic insights
- Exclusive shop previews and offers
- Behind-the-scenes creative content

If you ever want to unsubscribe, you can do so anytime from the footer of any email we send you.

Best regards,
The Art Platform Team`,
  };
}

export function getBookDownloadEmailTemplate(email: string, downloadLink: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Your Free Art Guide is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">📚 Your Guide is Ready!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Comprehensive Artist Portfolio & Creative Insights</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Thank you for requesting our free artist guide! Your download is ready and waiting for you.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${downloadLink}" style="display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Download Your Guide Now
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>Inside you'll find:</strong>
          </p>
          <ul style="color: #666; font-size: 14px; line-height: 1.8;">
            <li>Complete portfolio overview with 20+ high-resolution images</li>
            <li>Artist statement and creative philosophy</li>
            <li>Behind-the-scenes creative process insights</li>
            <li>Artistic techniques and tips for enthusiasts</li>
            <li>Exclusive shop preview and limited editions catalog</li>
          </ul>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            If the download link doesn't work, you can copy and paste this URL into your browser:<br/>
            <code style="background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${downloadLink}</code>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Happy exploring!<br/>
            <strong>The Art Platform Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2024 Art Platform. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Your Free Art Guide is Ready!

Thank you for requesting our free artist guide! Your download is ready.

Download: ${downloadLink}

Inside you'll find:
- Complete portfolio overview with 20+ high-resolution images
- Artist statement and creative philosophy
- Behind-the-scenes creative process insights
- Artistic techniques and tips for enthusiasts
- Exclusive shop preview and limited editions catalog

Happy exploring!
The Art Platform Team`,
  };
}

export function getNewsletterEmailTemplate(subject: string, content: string): { subject: string; html: string; text: string } {
  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📬 Latest Update</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <div style="color: #333; font-size: 14px; line-height: 1.8;">
            ${content}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Have questions? <a href="mailto:${process.env.ADMIN_EMAIL || 'admin@example.com'}" style="color: #3b82f6; text-decoration: none;">Get in touch</a>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2024 Art Platform. All rights reserved.</p>
        </div>
      </div>
    `,
    text: content,
  };
}

export function getOrderConfirmationEmailTemplate(
  email: string,
  orderId: string,
  productName: string,
  productPrice: number
): { subject: string; html: string; text: string } {
  return {
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✓ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Thank you for your order! We've received your request and will process it shortly.
          </p>
          <div style="background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>Order ID:</strong> ${orderId}<br/>
              <strong>Product:</strong> ${productName}<br/>
              <strong>Amount:</strong> $${productPrice.toFixed(2)}
            </p>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            We'll send you a shipping confirmation email as soon as your order ships. If you have any questions, feel free to reach out to us.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            <strong>The Art Platform Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2024 Art Platform. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Order Confirmed!

Thank you for your order! We've received your request and will process it shortly.

Order Details:
Order ID: ${orderId}
Product: ${productName}
Amount: $${productPrice.toFixed(2)}

We'll send you a shipping confirmation email as soon as your order ships. If you have any questions, feel free to reach out.

Best regards,
The Art Platform Team`,
  };
}

// Batch sending utility for newsletters
export async function sendNewsletterBatch(
  recipientEmails: string[],
  subject: string,
  content: string,
  onProgress?: (sent: number, total: number) => void
) {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  for (let i = 0; i < recipientEmails.length; i++) {
    const email = recipientEmails[i];
    try {
      const template = getNewsletterEmailTemplate(subject, content);
      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      results.sent++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Call progress callback
    if (onProgress) {
      onProgress(results.sent + results.failed, recipientEmails.length);
    }

    // Add small delay between emails to avoid rate limiting
    if (i < recipientEmails.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

// Verify transporter connection
export async function verifyEmailTransporter() {
  try {
    const transporter = getEmailTransporter();
    await transporter.verify();
    return { success: true, message: 'Email transporter is configured correctly' };
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Email transporter verification failed',
    };
  }
}
