import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    console.log(`\x1b[33m[SANDBOX AUTH]\x1b[0m Password reset requested for ${email}. Token: \x1b[32m${resetToken}\x1b[0m`);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.',
      isDevMode: true,
      devResetToken: resetToken,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
