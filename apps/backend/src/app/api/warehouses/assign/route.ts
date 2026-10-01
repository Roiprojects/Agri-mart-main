import { NextResponse } from 'next/server';
import { assignNearestWarehouse } from '@/lib/warehouse-assignment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude, pincode } = body;

    const result = assignNearestWarehouse(latitude, longitude, pincode);

    return NextResponse.json({
      success: true,
      allocation: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload for warehouse routing' },
      { status: 400 }
    );
  }
}
