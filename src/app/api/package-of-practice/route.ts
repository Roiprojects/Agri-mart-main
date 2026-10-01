import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const inMemoryFallback: Array<Record<string, any>> = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const trackingCode =
      data.slNo || `CDF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let record: any = null;

    try {
      record = await prisma.packageOfPractice.create({
        data: {
          slNo: trackingCode,
          date: data.date ? new Date(data.date) : new Date(),
          vleFpoNo: data.vleFpoNo || null,
          district: data.district || 'Mandya',
          taluk: data.taluk || '',
          villagePanchayat: data.villagePanchayat || '',
          state: data.state || 'Karnataka',
          name: data.name || '',
          mobileNumber: data.mobileNumber || '',
          emailId: data.emailId || null,
          address: data.address || '',
          surveyNumber: data.surveyNumber || '',
          acres: parseFloat(data.acres) || 1.0,
          pinCode: data.pinCode || '',
          jobWorkLocation: data.jobWorkLocation || '',
          distanceFromVle: parseFloat(data.distanceFromVle) || 0,
          irrigation: Array.isArray(data.irrigation) ? data.irrigation : [],
          jobWork: Array.isArray(data.jobWork) ? data.jobWork : [],
          crop: data.crop || 'Maize',
          cropCycleDays: parseInt(data.cropCycleDays, 10) || 110,
          popAttached: data.popAttached || null,
          schedule: data.schedule || [],
          status: 'SUBMITTED',
        },
      });
    } catch (dbErr: any) {
      console.warn('Prisma DB insert fallback:', dbErr.message);
      record = {
        id: `pop_${Date.now()}`,
        trackingCode,
        ...data,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };
      inMemoryFallback.push(record);
    }

    return NextResponse.json({
      success: true,
      message: 'Package of Practice & Customer Data Form registered successfully.',
      trackingCode,
      record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      try {
        const found = await prisma.packageOfPractice.findFirst({
          where: {
            OR: [{ id: code }, { slNo: code }],
          },
        });
        if (found) {
          return NextResponse.json({ success: true, record: found });
        }
      } catch (e) {
        // Fallback to in-memory
      }

      const memoryFound = inMemoryFallback.find(
        (f) => f.trackingCode === code || f.slNo === code || f.id === code
      );
      if (memoryFound) {
        return NextResponse.json({ success: true, record: memoryFound });
      }

      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    let records: any[] = [];
    try {
      records = await prisma.packageOfPractice.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      records = inMemoryFallback;
    }

    return NextResponse.json({
      success: true,
      total: records.length,
      records,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
