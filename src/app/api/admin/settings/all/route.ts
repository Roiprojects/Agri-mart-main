import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface SettingItem {
  id: string;
  name: string;
  value: string;
  store: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nameFilter = (searchParams.get('name') || '').trim().toLowerCase();
    const valueFilter = (searchParams.get('value') || '').trim().toLowerCase();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

    const db = readDb();
    let settings: SettingItem[] = db.allSettings || [];

    if (nameFilter) {
      settings = settings.filter((s) => s.name?.toLowerCase().includes(nameFilter));
    }
    if (valueFilter) {
      settings = settings.filter((s) => s.value?.toLowerCase().includes(valueFilter));
    }

    const total = settings.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = settings.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      pageSize,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, value, store } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Setting name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.allSettings) {
      db.allSettings = [];
    }

    // Check for duplicate name in the same store
    const existingIndex = db.allSettings.findIndex(
      (s: SettingItem) => s.name?.toLowerCase() === name.trim().toLowerCase() && s.store === (store || 'All')
    );

    const newSetting: SettingItem = {
      id: String(Date.now()),
      name: name.trim(),
      value: value !== undefined ? String(value) : '',
      store: store || 'All',
    };

    if (existingIndex >= 0) {
      db.allSettings[existingIndex] = { ...db.allSettings[existingIndex], ...newSetting };
    } else {
      db.allSettings.unshift(newSetting);
    }

    const success = writeDb(db);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to save setting to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newSetting,
      message: 'Setting created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create setting' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, value, store } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const settings: SettingItem[] = db.allSettings || [];
    const index = settings.findIndex((s) => s.id === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Setting not found' },
        { status: 404 }
      );
    }

    const updated = {
      ...settings[index],
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(value !== undefined ? { value: String(value) } : {}),
      ...(store !== undefined ? { store } : {}),
    };

    settings[index] = updated;
    db.allSettings = settings;

    const success = writeDb(db);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to update setting in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Setting updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update setting' },
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
        { success: false, message: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const settings: SettingItem[] = db.allSettings || [];
    const initialLen = settings.length;
    const filtered = settings.filter((s) => s.id !== String(id));

    if (filtered.length === initialLen) {
      return NextResponse.json(
        { success: false, message: 'Setting not found' },
        { status: 404 }
      );
    }

    db.allSettings = filtered;
    const success = writeDb(db);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete setting from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete setting' },
      { status: 500 }
    );
  }
}
