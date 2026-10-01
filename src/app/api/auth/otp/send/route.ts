import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mobile = body.mobile || '9845190812';
    
    return NextResponse.json({
      success: true,
      message: `Sandbox SMS Gateway: Your verification OTP is 123456 (Sent to +91-${mobile.slice(-10)})`,
      devOtp: '123456',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to dispatch OTP' },
      { status: 400 }
    );
  }
}
