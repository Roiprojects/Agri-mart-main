import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const languages = db.languages || [];
    const language = languages.find((l: any) => String(l.id) === String(id));

    if (!language) {
      return NextResponse.json(
        { success: false, message: 'Language not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: language,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch language' },
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
    const languages = db.languages || [];
    const index = languages.findIndex((l: any) => String(l.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Language not found' },
        { status: 404 }
      );
    }

    const updated = {
      ...languages[index],
      ...body,
    };

    languages[index] = updated;
    db.languages = languages;
    writeDb(db);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Language updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update language' },
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
    const languages = db.languages || [];
    const filtered = languages.filter((l: any) => String(l.id) !== String(id));

    if (filtered.length === languages.length) {
      return NextResponse.json(
        { success: false, message: 'Language not found' },
        { status: 404 }
      );
    }

    db.languages = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Language deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete language' },
      { status: 500 }
    );
  }
}
