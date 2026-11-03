import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { CartValidationRequest, CartValidationResponse } from '@agrimart/contracts';

export async function POST(req: NextRequest) {
  try {
    const body: CartValidationRequest = await req.json();
    const items = body.items || [];

    if (items.length === 0) {
      return NextResponse.json({
        isValid: false,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        warnings: ['Cart is empty'],
      } satisfies CartValidationResponse);
    }

    let subtotal = 0;
    let isValid = true;
    const validatedItems: CartValidationResponse['items'] = [];
    const warnings: string[] = [];

    for (const item of items) {
      const full = devDb.getProductWithDetails(item.productId);
      if (!full) {
        isValid = false;
        warnings.push(`Product #${item.productId} was not found in active catalogue.`);
        continue;
      }

      // Check authoritative price
      let unitPrice = full.price;
      const totalStock = (full.warehouseStocks || []).reduce((acc: number, ws: any) => acc + (ws.quantity || 0), 0);
      let availableStock = totalStock > 0 ? totalStock : 10;

      // Check variant if specified
      if (item.variantId && full.variants) {
        const variant = full.variants.find((v: any) => v.id === item.variantId);
        if (variant) {
          unitPrice = variant.price;
        }
      }

      const inStock = availableStock >= item.quantity;
      if (!inStock) {
        isValid = false;
        warnings.push(`Insufficient stock for ${full.name}. Available: ${availableStock}, Requested: ${item.quantity}.`);
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      const mediaUrl = full.media?.[0]?.url || 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';

      validatedItems.push({
        productId: full.id,
        variantId: item.variantId,
        title: full.name,
        sku: full.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        imageUrl: mediaUrl,
        inStock,
        availableStock,
        priceChanged: false,
      });
    }

    // Free delivery above ₹1,000
    const deliveryFee = subtotal >= 1000 ? 0 : 75;
    const tax = Math.round(subtotal * 0.05); // 5% GST on agriculture supplies
    const total = subtotal + deliveryFee + tax;

    const responseData: CartValidationResponse = {
      isValid,
      items: validatedItems,
      subtotal,
      discount: 0,
      deliveryFee,
      tax,
      total,
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    return NextResponse.json(responseData);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to revalidate cart' },
      { status: 500 }
    );
  }
}
