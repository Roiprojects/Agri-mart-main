import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface TaxCategoryItem {
  id: string;
  name: string;
  displayOrder: number;
}

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for tax categories:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for tax categories:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const categories: TaxCategoryItem[] = (db.taxCategories || []).sort(
      (a: TaxCategoryItem, b: TaxCategoryItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch tax categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, displayOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.taxCategories) {
      db.taxCategories = [];
    }

    // Generate unique ID
    const newId = String(Date.now());
    const newCategory: TaxCategoryItem = {
      id: newId,
      name: name.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0,
    };

    db.taxCategories.push(newCategory);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The new tax category has been added successfully.',
      data: newCategory,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create tax category' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, displayOrder } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Tax category ID is required' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const categories: TaxCategoryItem[] = db.taxCategories || [];
    const index = categories.findIndex((c) => String(c.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Tax category not found' },
        { status: 404 }
      );
    }

    categories[index] = {
      ...categories[index],
      name: name.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0,
    };

    db.taxCategories = categories;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The tax category has been updated successfully.',
      data: categories[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update tax category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // query param was empty and no JSON body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Tax category ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const categories: TaxCategoryItem[] = db.taxCategories || [];
    const filtered = categories.filter((c) => String(c.id) !== String(id));

    if (filtered.length === categories.length) {
      return NextResponse.json(
        { success: false, message: 'Tax category not found' },
        { status: 404 }
      );
    }

    db.taxCategories = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The tax category has been deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete tax category' },
      { status: 500 }
    );
  }
}
