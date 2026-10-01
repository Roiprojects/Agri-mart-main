import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mobile, code } = body;

    // In sandbox demo mode, accept 123456 or any 6-digit code
    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 6-digit OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: 'usr-' + (mobile || '9845190812'),
        name: 'Basavaraj Patil',
        mobile: mobile || '9845190812',
        role: 'farmer',
        isVerified: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Verification error' },
      { status: 400 }
    );
  }
}
