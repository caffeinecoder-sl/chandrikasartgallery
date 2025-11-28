import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, secretKey } = await request.json();

    // Simple protection - require a secret key
    // Set ADMIN_SETUP_KEY in your .env file
    const setupKey = process.env.ADMIN_SETUP_KEY || 'change-this-secret-key-123';
    
    if (secretKey !== setupKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists', email: existingAdmin.email },
        { status: 400 }
      );
    }

    // Check if user with this email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const admin = await User.create({
      email,
      password, // Will be hashed by the pre-save hook
      name: name || 'Admin',
      role: 'admin',
    });

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        email: admin.email,
        name: admin.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET method to check if admin exists
export async function GET() {
  try {
    await connectToDatabase();
    const adminExists = await User.findOne({ role: 'admin' });
    
    return NextResponse.json({
      adminExists: !!adminExists,
      email: adminExists ? adminExists.email : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
