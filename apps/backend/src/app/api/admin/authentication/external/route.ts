import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

interface ExternalAuthItem {
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
    console.error('Failed reading DB file for external auth:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for external auth:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const methods: ExternalAuthItem[] = (db.externalAuthMethods || []).sort(
      (a: ExternalAuthItem, b: ExternalAuthItem) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
    return NextResponse.json({ success: true, data: methods, total: methods.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch auth methods' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    let methods: ExternalAuthItem[] = db.externalAuthMethods || [];

    if (body.action === 'saveConfig') {
      const { id, config } = body;
      const index = methods.findIndex((m) => String(m.id) === String(id));
      if (index === -1) {
        return NextResponse.json({ success: false, message: 'Method not found' }, { status: 404 });
      }
      methods[index].config = { ...(methods[index].config || {}), ...config };
      db.externalAuthMethods = methods;
      writeDb(db);
      return NextResponse.json({ success: true, message: 'Configuration saved successfully.', data: methods[index] });
    }

    const { friendlyName, systemName, displayOrder, isActive, config } = body;
    if (!friendlyName || !systemName) {
      return NextResponse.json({ success: false, message: 'Friendly name and system name are required' }, { status: 400 });
    }

    const newMethod: ExternalAuthItem = {
      id: String(Date.now()),
      friendlyName: friendlyName.trim(),
      systemName: systemName.trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 1,
      isActive: Boolean(isActive),
      config: config || {},
    };

    methods.push(newMethod);
    db.externalAuthMethods = methods;
    writeDb(db);
    return NextResponse.json({ success: true, message: 'New authentication method added.', data: newMethod });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, displayOrder, isActive, friendlyName, systemName } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Method ID is required' }, { status: 400 });
    }

    const db = readDb();
    const methods: ExternalAuthItem[] = db.externalAuthMethods || [];
    const index = methods.findIndex((m) => String(m.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Method not found' }, { status: 404 });
    }

    if (displayOrder !== undefined) methods[index].displayOrder = typeof displayOrder === 'number' ? displayOrder : parseInt(displayOrder, 10) || 0;
    if (isActive !== undefined) methods[index].isActive = Boolean(isActive);
    if (friendlyName !== undefined) methods[index].friendlyName = friendlyName.trim();
    if (systemName !== undefined) methods[index].systemName = systemName.trim();

    db.externalAuthMethods = methods;
    writeDb(db);

    return NextResponse.json({ success: true, message: 'Authentication method updated successfully.', data: methods[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update method' }, { status: 500 });
  }
}
