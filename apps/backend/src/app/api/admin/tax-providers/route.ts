import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface TaxProviderItem {
  id: string;
  friendlyName: string;
  systemName: string;
  isPrimary: boolean;
  displayOrder: number;
  config?: Record<string, any>;
}

export async function GET() {
  try {
    const db = readDb();
    const providers: TaxProviderItem[] = db.taxProviders || [];
    return NextResponse.json({
      success: true,
      data: providers,
      total: providers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch tax providers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    let providers: TaxProviderItem[] = db.taxProviders || [];

    // Action: Set primary provider
    if (body.action === 'setPrimary') {
      const { id } = body;
      if (!id) {
        return NextResponse.json(
          { success: false, message: 'Provider ID is required' },
          { status: 400 }
        );
      }

      providers = providers.map((p) => ({
        ...p,
        isPrimary: String(p.id) === String(id),
      }));

      db.taxProviders = providers;
      writeDb(db);

      const updatedPrimary = providers.find((p) => String(p.id) === String(id));
      return NextResponse.json({
        success: true,
        data: providers,
        message: `${updatedPrimary?.friendlyName || 'Provider'} marked as primary tax provider.`,
      });
    }

    // Action: Update provider configuration
    if (body.action === 'configure' || body.id) {
      const { id, config } = body;
      const index = providers.findIndex((p) => String(p.id) === String(id));
      if (index === -1) {
        return NextResponse.json(
          { success: false, message: 'Provider not found' },
          { status: 404 }
        );
      }

      providers[index] = {
        ...providers[index],
        config: { ...providers[index].config, ...config },
      };

      db.taxProviders = providers;
      writeDb(db);

      return NextResponse.json({
        success: true,
        data: providers[index],
        message: 'Tax provider configured successfully.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update tax provider' },
      { status: 500 }
    );
  }
}
