import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, code } = body;

    if (!mobile || !code) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and OTP code are required.' },
        { status: 400 }
      );
    }

    const result = devDb.verifyOtp(mobile, code);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: result.user.id,
        name: result.user.name,
        mobile: result.user.mobile,
        email: result.user.email,
        role: result.user.role,
        isVerified: result.user.isVerified,
      },
    });

    // Set auth cookie
    response.cookies.set('agri_auth_user', JSON.stringify({
      id: result.user.id,
      name: result.user.name,
      mobile: result.user.mobile,
      role: result.user.role,
    }), {
      path: '/',
      httpOnly: false, // accessible to client for greeting display
      sameSite: 'lax',
      maxAge: 86400 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
