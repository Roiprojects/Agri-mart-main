import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface CountryItem {
  id: string;
  name: string;
  allowsBilling: boolean;
  allowsShipping: boolean;
  twoLetterIsoCode: string;
  threeLetterIsoCode: string;
  numericIsoCode: number;
  subjectToVat: boolean;
  limitedToStores?: string;
  numberOfStates?: number;
  displayOrder: number;
  published: boolean;
  states?: Array<{
    id: string;
    name: string;
    abbreviation: string;
    published: boolean;
    displayOrder: number;
  }>;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || searchParams.get('name') || '').trim().toLowerCase();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

    const db = readDb();
    let countries: CountryItem[] = db.countries || [];

    if (search) {
      countries = countries.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.twoLetterIsoCode?.toLowerCase().includes(search) ||
          c.threeLetterIsoCode?.toLowerCase().includes(search)
      );
    }

    const total = countries.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = countries.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      pageSize,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      allowsBilling = true,
      allowsShipping = true,
      twoLetterIsoCode = '',
      threeLetterIsoCode = '',
      numericIsoCode = 0,
      subjectToVat = false,
      limitedToStores = '',
      published = true,
      displayOrder = 0,
      states = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Country name is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    if (!db.countries) {
      db.countries = [];
    }

    const newCountry: CountryItem = {
      id: String(Date.now()),
      name: name.trim(),
      allowsBilling: Boolean(allowsBilling),
      allowsShipping: Boolean(allowsShipping),
      twoLetterIsoCode: (twoLetterIsoCode || '').trim().toUpperCase(),
      threeLetterIsoCode: (threeLetterIsoCode || '').trim().toUpperCase(),
      numericIsoCode: Number(numericIsoCode) || 0,
      subjectToVat: Boolean(subjectToVat),
      limitedToStores: limitedToStores || '',
      numberOfStates: Array.isArray(states) ? states.length : 0,
      displayOrder: Number(displayOrder) || 0,
      published: Boolean(published),
      states: Array.isArray(states) ? states : [],
    };

    db.countries.unshift(newCountry);
    const success = writeDb(db);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to write country to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newCountry,
      message: 'Country added successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to add country' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    const countries: CountryItem[] = db.countries || [];

    // Bulk action: publish or unpublish selected
    if (body.action === 'publish' || body.action === 'unpublish') {
      const targetState = body.action === 'publish';
      const targetIds: string[] = body.ids || [];

      if (!targetIds.length) {
        return NextResponse.json(
          { success: false, message: 'No countries selected' },
          { status: 400 }
        );
      }

      db.countries = countries.map((c) => {
        if (targetIds.includes(c.id)) {
          return { ...c, published: targetState };
        }
        return c;
      });

      writeDb(db);
      return NextResponse.json({
        success: true,
        message: `Selected countries ${targetState ? 'published' : 'unpublished'} successfully`,
      });
    }

    // Single country update
    const { id, ...fields } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Country ID is required' },
        { status: 400 }
      );
    }

    const index = countries.findIndex((c) => c.id === String(id));
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Country not found' },
        { status: 404 }
      );
    }

    const updated: CountryItem = {
      ...countries[index],
      ...fields,
      numberOfStates: fields.states ? fields.states.length : countries[index].numberOfStates,
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Country ID is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const countries: CountryItem[] = db.countries || [];
    const filtered = countries.filter((c) => c.id !== String(id));

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
