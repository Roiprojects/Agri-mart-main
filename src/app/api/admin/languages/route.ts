import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface StringResource {
  id: string;
  name: string;
  value: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  flag: string;
  flagEmoji?: string;
  languageCulture: string;
  uniqueSeoCode: string;
  rightToLeft: boolean;
  defaultCurrency: string;
  limitedToStores?: string;
  displayOrder: number;
  published: boolean;
  resources?: StringResource[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

    const db = readDb();
    const languages: LanguageItem[] = db.languages || [];

    const total = languages.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = languages.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      pageSize,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      flag = 'ad.png',
      flagEmoji = '🌐',
      languageCulture = 'aa-DJ',
      uniqueSeoCode = '',
      rightToLeft = false,
      defaultCurrency = '---',
      limitedToStores = '',
      displayOrder = 3,
      published = true,
      resources = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Language name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.languages) {
      db.languages = [];
    }

    const newLanguage: LanguageItem = {
      id: String(Date.now()),
      name: name.trim(),
      flag,
      flagEmoji: flagEmoji || '🌐',
      languageCulture,
      uniqueSeoCode: uniqueSeoCode || name.trim().toLowerCase().slice(0, 3),
      rightToLeft: Boolean(rightToLeft),
      defaultCurrency: defaultCurrency || '---',
      limitedToStores: limitedToStores || '',
      displayOrder: Number(displayOrder) || 0,
      published: Boolean(published),
      resources: resources || [],
    };

    db.languages.push(newLanguage);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to write language to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newLanguage,
      message: 'Language created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create language' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Language ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const languages: LanguageItem[] = db.languages || [];
    const index = languages.findIndex((l) => String(l.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Language not found' },
        { status: 404 }
      );
    }

    const updated = {
      ...languages[index],
      ...fields,
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Language ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const languages: LanguageItem[] = db.languages || [];
    const filtered = languages.filter((l) => String(l.id) !== String(id));

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
