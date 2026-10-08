import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for country:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for country:', err);
    return false;
  }
}

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
