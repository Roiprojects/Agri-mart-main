import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

interface StaffPhoneOtpRecord {
  phone: string;
  cleanPhone: string;
  otp: string;
  passwordType: 'MANUAL' | 'AUTO_GENERATED' | 'CHANGE_PASSWORD';
  verified: boolean;
  createdAt: string;
  expiresAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = (body.action || 'SEND').toUpperCase();
    const rawPhone = String(body.phone || body.mobile || '').trim();
    const digitsOnly = rawPhone.replace(/\D/g, '');

    if (!rawPhone || digitsOnly.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Phone Number first.' },
        { status: 400 }
      );
    }

    const cleanPhone = digitsOnly.slice(-10);

    const raw = devDb.getRawData() as any;
    if (!raw.staffPhoneOtps || typeof raw.staffPhoneOtps !== 'object') {
      raw.staffPhoneOtps = {};
    }

    if (action === 'SEND') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
      const passwordType =
        body.passwordType === 'AUTO_GENERATED'
          ? 'AUTO_GENERATED'
          : body.passwordType === 'CHANGE_PASSWORD'
          ? 'CHANGE_PASSWORD'
          : 'MANUAL';

      const record: StaffPhoneOtpRecord = {
        phone: rawPhone,
        cleanPhone,
        otp,
        passwordType,
        verified: false,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      raw.staffPhoneOtps[cleanPhone] = record;
      devDb.save();

      console.log(
        `\x1b[36m[PHONE SMS OTP DISPATCH]\x1b[0m Sent 6-digit OTP \x1b[32m${otp}\x1b[0m to Phone Number: \x1b[33m${rawPhone}\x1b[0m (${passwordType})`
      );

      return NextResponse.json({
        success: true,
        phone: rawPhone,
        cleanPhone,
        otp,
        passwordType,
        message: `OTP has been sent to phone number ${rawPhone}. Please enter the 6-digit OTP to verify.`,
      });
    }

    if (action === 'VERIFY') {
      const enteredOtp = String(body.otp || '').trim();
      const existing: StaffPhoneOtpRecord | undefined = raw.staffPhoneOtps[cleanPhone];

      if (!existing) {
        return NextResponse.json(
          {
            success: false,
            error: `No OTP request found for ${rawPhone}. Please click "Send OTP" first.`,
          },
          { status: 400 }
        );
      }

      if (new Date(existing.expiresAt).getTime() < Date.now()) {
        return NextResponse.json(
          {
            success: false,
            error: 'OTP has expired. Please request a new OTP.',
          },
          { status: 400 }
        );
      }

      if (existing.otp !== enteredOtp) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid OTP code entered. Please check the OTP sent to the phone number.',
          },
          { status: 400 }
        );
      }

      existing.verified = true;
      raw.staffPhoneOtps[cleanPhone] = existing;
      devDb.save();

      return NextResponse.json({
        success: true,
        verified: true,
        phone: rawPhone,
        cleanPhone,
        message: `OTP verified successfully for phone number ${rawPhone}!`,
      });
    }

    if (action === 'CHANGE_PASSWORD') {
      const staffId = String(body.staffId || '').trim();
      const enteredOtp = String(body.otp || '').trim();
      const newPassword = String(body.newPassword || '').trim();

      if (!staffId) {
        return NextResponse.json({ success: false, error: 'Staff ID is required.' }, { status: 400 });
      }

      if (!newPassword) {
        return NextResponse.json(
          { success: false, error: 'Please enter the new password.' },
          { status: 400 }
        );
      }

      const existingOtp: StaffPhoneOtpRecord | undefined = raw.staffPhoneOtps[cleanPhone];
      if (!existingOtp || (!existingOtp.verified && existingOtp.otp !== enteredOtp)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Please verify the correct OTP sent to the phone number before setting a new password.',
          },
          { status: 400 }
        );
      }

      const staffList = Array.isArray(raw.staffMembers) ? raw.staffMembers : [];
      const idx = staffList.findIndex((s: any) => s.id === staffId);
      if (idx < 0) {
        return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 });
      }

      const now = new Date().toISOString();

      // Delete old password completely and replace with the permanent new password
      delete staffList[idx].oldPassword;
      delete staffList[idx].previousPassword;
      staffList[idx] = {
        ...staffList[idx],
        mobile: rawPhone,
        password: newPassword,
        emailVerified: true,
        updatedAt: now,
      };

      raw.staffMembers = staffList;
      // Clear used OTP so it cannot be reused
      delete raw.staffPhoneOtps[cleanPhone];
      devDb.save();

      return NextResponse.json({
        success: true,
        data: staffList[idx],
        message: `Permanent password updated for ${staffList[idx].name}! The old password has been deleted and can no longer be used to log in.`,
      });
    }

    if (action === 'LOGIN_TEST') {
      const enteredPassword = String(body.password || '');
      const staffList = Array.isArray(raw.staffMembers) ? raw.staffMembers : [];
      const member = staffList.find(
        (s: any) =>
          (body.staffId && s.id === body.staffId) ||
          String(s.mobile || '').replace(/\D/g, '').slice(-10) === cleanPhone
      );

      if (!member) {
        return NextResponse.json(
          { success: false, error: 'No staff member found with this Phone Number.' },
          { status: 404 }
        );
      }

      if (!member.password || member.password !== enteredPassword) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid password! Old passwords are deleted and cannot be used to log in.',
          },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        data: member,
        message: `Login successful for ${member.name} (${member.mobile}) using permanent password.`,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported OTP action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
