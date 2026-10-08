import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface DateRangeItem {
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
    console.error('Failed reading DB file for dates and ranges:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for dates and ranges:', err);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const db = readDb();
    const deliveryDates: DateRangeItem[] = (db.deliveryDates || []).sort(
      (a: DateRangeItem, b: DateRangeItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
    const availabilityRanges: DateRangeItem[] = (db.productAvailabilityRanges || []).sort(
      (a: DateRangeItem, b: DateRangeItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );

    if (type === 'deliveryDates' || type === 'delivery-dates' || type === 'deliveryDate') {
      return NextResponse.json({
        success: true,
        data: deliveryDates,
        total: deliveryDates.length,
      });
    }

    if (type === 'availabilityRanges' || type === 'product-availability-ranges' || type === 'availabilityRange') {
      return NextResponse.json({
        success: true,
        data: availabilityRanges,
        total: availabilityRanges.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        deliveryDates,
        availabilityRanges,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch dates and ranges' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name, displayOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const isDelivery = type === 'deliveryDate' || type === 'deliveryDates';
    const key = isDelivery ? 'deliveryDates' : 'productAvailabilityRanges';

    if (!db[key]) db[key] = [];

    const newItem: DateRangeItem = {
      id: String(Date.now()),
      name: name.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 1,
    };

    db[key].push(newItem);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `${isDelivery ? 'Delivery date' : 'Product availability range'} has been added successfully.`,
      data: newItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to add item' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { type, id, name, displayOrder } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const isDelivery = type === 'deliveryDate' || type === 'deliveryDates';
    const key = isDelivery ? 'deliveryDates' : 'productAvailabilityRanges';
    const items: DateRangeItem[] = db[key] || [];

    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    if (name !== undefined && name.trim()) items[index].name = name.trim();
    if (displayOrder !== undefined) {
      items[index].displayOrder = typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0;
    }

    db[key] = items;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `${isDelivery ? 'Delivery date' : 'Product availability range'} has been updated successfully.`,
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
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const isDelivery = type === 'deliveryDate' || type === 'deliveryDates';
    const key = isDelivery ? 'deliveryDates' : 'productAvailabilityRanges';
    const items: DateRangeItem[] = db[key] || [];

    const filtered = items.filter((i) => String(i.id) !== String(id));
    if (filtered.length === items.length) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    db[key] = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `${isDelivery ? 'Delivery date' : 'Product availability range'} has been deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
