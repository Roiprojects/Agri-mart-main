import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface ShippingProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  displayOrder: number;
  isActive: boolean;
  config?: Record<string, any>;
}

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for shipping providers:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for shipping providers:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const providers: ShippingProviderItem[] = (db.shippingProviders || []).sort(
      (a: ShippingProviderItem, b: ShippingProviderItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );

    return NextResponse.json({
      success: true,
      data: providers,
      total: providers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch shipping providers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    let providers: ShippingProviderItem[] = db.shippingProviders || [];

    // Action: Toggle active status
    if (body.action === 'toggleActive') {
      const { id } = body;
      const index = providers.findIndex((p) => String(p.id) === String(id));
      if (index === -1) {
        return NextResponse.json(
          { success: false, message: 'Shipping provider not found' },
          { status: 404 }
        );
      }
      providers[index].isActive = !providers[index].isActive;
      db.shippingProviders = providers;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: `Provider ${providers[index].friendlyName} is now ${providers[index].isActive ? 'Active' : 'Inactive'}.`,
        data: providers[index],
      });
    }

    // Action: Save configuration
    if (body.action === 'saveConfig') {
      const { id, config } = body;
      const index = providers.findIndex((p) => String(p.id) === String(id));
      if (index === -1) {
        return NextResponse.json(
          { success: false, message: 'Shipping provider not found' },
          { status: 404 }
        );
      }
      providers[index].config = {
        ...(providers[index].config || {}),
        ...config,
      };
      db.shippingProviders = providers;
      writeDb(db);

      return NextResponse.json({
        success: true,
        message: 'Shipping provider configuration saved successfully.',
        data: providers[index],
      });
    }

    // Create new shipping provider
    const { friendlyName, systemName, displayOrder, isActive, config } = body;
    if (!friendlyName || !systemName) {
      return NextResponse.json(
        { success: false, message: 'Friendly name and system name are required' },
        { status: 400 }
      );
    }

    const newProvider: ShippingProviderItem = {
      id: String(Date.now()),
      friendlyName: friendlyName.trim(),
      systemName: systemName.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0,
      isActive: Boolean(isActive),
      config: config || {},
    };

    providers.push(newProvider);
    db.shippingProviders = providers;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'New shipping provider added successfully.',
      data: newProvider,
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
    const { id, friendlyName, systemName, displayOrder, isActive, config } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Shipping provider ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const providers: ShippingProviderItem[] = db.shippingProviders || [];
    const index = providers.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Shipping provider not found' },
        { status: 404 }
      );
    }

    if (friendlyName !== undefined) providers[index].friendlyName = friendlyName.trim();
    if (systemName !== undefined) providers[index].systemName = systemName.trim();
    if (displayOrder !== undefined) {
      providers[index].displayOrder = typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0;
    }
    if (isActive !== undefined) providers[index].isActive = Boolean(isActive);
    if (config !== undefined) {
      providers[index].config = {
        ...(providers[index].config || {}),
        ...config,
      };
    }

    db.shippingProviders = providers;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The shipping provider has been updated successfully.',
      data: providers[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update shipping provider' },
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
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Shipping provider ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const providers: ShippingProviderItem[] = db.shippingProviders || [];
    const filtered = providers.filter((p) => String(p.id) !== String(id));

    if (filtered.length === providers.length) {
      return NextResponse.json(
        { success: false, message: 'Shipping provider not found' },
        { status: 404 }
      );
    }

    db.shippingProviders = filtered;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'The shipping provider has been deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete shipping provider' },
      { status: 500 }
    );
  }
}
