import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const countries = db.countries || [];
    const country = countries.find((c: any) => String(c.id) === String(id));

    if (!country) {
      return NextResponse.json(
        { success: false, message: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: country,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch country' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    const countries = db.countries || [];
    const index = countries.findIndex((c: any) => String(c.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Country not found' },
        { status: 404 }
      );
    }

    const updated = {
      ...countries[index],
      ...body,
      numberOfStates: body.states ? body.states.length : countries[index].numberOfStates,
    };

    countries[index] = updated;
    db.countries = countries;
    writeDb(db);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Country updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update country' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const countries = db.countries || [];
    const filtered = countries.filter((c: any) => String(c.id) !== String(id));

    if (filtered.length === countries.length) {
      return NextResponse.json(
        { success: false, message: 'Country not found' },
        { status: 404 }
      );
    }

    db.countries = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Country deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete country' },
      { status: 500 }
    );
  }
}
