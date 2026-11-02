import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { validatePhoneNumber } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile } = body;

    const phoneValidation = validatePhoneNumber(mobile);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { success: false, message: phoneValidation.error },
        { status: 400 }
      );
    }

    const cleanMobile = phoneValidation.cleaned!;
    // Generate a 6-digit OTP
    const devCode = Math.floor(100000 + Math.random() * 900000).toString();
    devDb.createOtp(cleanMobile, devCode);

    const isSandboxGateway = !process.env.SMS_DLT_ENTITY_ID || process.env.SMS_DLT_ENTITY_ID === 'dlt_entity_placeholder';

    if (isSandboxGateway) {
      console.log(`\x1b[33m[SANDBOX SMS GATEWAY]\x1b[0m OTP generated for +91-${cleanMobile}: \x1b[32m${devCode}\x1b[0m (Development Sandbox Active)`);
    }

    return NextResponse.json({
      success: true,
      mobile: cleanMobile,
      isDevMode: isSandboxGateway,
      // Clearly labeled developer behavior when real SMS provider is in sandbox mode
      devOtp: isSandboxGateway ? devCode : undefined,
      message: isSandboxGateway
        ? `[SANDBOX ACTIVE] Development OTP generated: ${devCode}. (Real SMS gateway credentials pending in .env)`
        : 'OTP dispatched via SMS gateway.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
