import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface MeasureItem {
  id: string;
  name: string;
  systemKeyword: string;
  ratio: number;
  displayOrder: number;
  isPrimary: boolean;
}

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for measures:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for measures:', err);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const db = readDb();
    const dimensions: MeasureItem[] = (db.measureDimensions || []).sort(
      (a: MeasureItem, b: MeasureItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
    const weights: MeasureItem[] = (db.measureWeights || []).sort(
      (a: MeasureItem, b: MeasureItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );

    if (type === 'dimensions' || type === 'dimension') {
      return NextResponse.json({
        success: true,
        data: dimensions,
        total: dimensions.length,
      });
    }

    if (type === 'weights' || type === 'weight') {
      return NextResponse.json({
        success: true,
        data: weights,
        total: weights.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        dimensions,
        weights,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch measures' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    // Action: Mark as Primary
    if (body.action === 'markPrimary') {
      const { type, id } = body;
      const isDim = type === 'dimension' || type === 'dimensions';
      const key = isDim ? 'measureDimensions' : 'measureWeights';
      let items: MeasureItem[] = db[key] || [];

      items = items.map((item) => ({
        ...item,
        isPrimary: String(item.id) === String(id),
        ratio: String(item.id) === String(id) ? 1 : item.ratio,
      }));

      db[key] = items;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: `Primary ${isDim ? 'dimension' : 'weight'} updated successfully.`,
        data: items,
      });
    }

    // Create New Measure Record
    const { type, name, systemKeyword, ratio, displayOrder } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
    }
    if (!systemKeyword || !systemKeyword.trim()) {
      return NextResponse.json({ success: false, message: 'System keyword is required' }, { status: 400 });
    }

    const isDim = type === 'dimension' || type === 'dimensions';
    const key = isDim ? 'measureDimensions' : 'measureWeights';
    if (!db[key]) db[key] = [];

    const newItem: MeasureItem = {
      id: String(Date.now()),
      name: name.trim(),
      systemKeyword: systemKeyword.trim(),
      ratio: typeof ratio === 'number' ? ratio : parseFloat(String(ratio)) || 0,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(String(displayOrder), 10) || 0,
      isPrimary: false,
    };

    db[key].push(newItem);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `The new ${isDim ? 'dimension' : 'weight'} has been added successfully.`,
      data: newItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { type, id, name, systemKeyword, ratio, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Measure ID is required' }, { status: 400 });
    }

    const db = readDb();
    const isDim = type === 'dimension' || type === 'dimensions';
    const key = isDim ? 'measureDimensions' : 'measureWeights';
    const items: MeasureItem[] = db[key] || [];

    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    if (name !== undefined && name.trim()) items[index].name = name.trim();
    if (systemKeyword !== undefined && systemKeyword.trim()) items[index].systemKeyword = systemKeyword.trim();
    if (ratio !== undefined) items[index].ratio = typeof ratio === 'number' ? ratio : parseFloat(String(ratio)) || 0;
    if (displayOrder !== undefined) {
      items[index].displayOrder = typeof displayOrder === 'number' ? displayOrder : parseInt(String(displayOrder), 10) || 0;
    }

    db[key] = items;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `The ${isDim ? 'dimension' : 'weight'} has been updated successfully.`,
      data: items[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    let type = searchParams.get('type');

    if (!id || !type) {
      try {
        const body = await req.json();
        id = id || body?.id;
        type = type || body?.type;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Measure ID is required' }, { status: 400 });
    }

    const db = readDb();
    const isDim = type === 'dimension' || type === 'dimensions';
    const key = isDim ? 'measureDimensions' : 'measureWeights';
    const items: MeasureItem[] = db[key] || [];

    const target = items.find((i) => String(i.id) === String(id));
    if (target?.isPrimary) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete the primary measure.' },
        { status: 400 }
      );
    }

    const filtered = items.filter((i) => String(i.id) !== String(id));
    if (filtered.length === items.length) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    db[key] = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `The ${isDim ? 'dimension' : 'weight'} has been deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
