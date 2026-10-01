import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

interface CartCalculateItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items = [], couponCode, pincode = '580026' } = body as {
      items: CartCalculateItem[];
      couponCode?: string;
      pincode?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: true,
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        items: [],
      });
    }

    let subtotal = 0;
    let tax = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = devDb.getProductById(item.productId);
      if (!product) continue;

      const variants = devDb.getVariantsByProductId(product.id);
      const variant = item.variantId ? variants.find((v) => v.id === item.variantId) : variants.find((v) => v.isDefault) || variants[0];
      const unitPrice = variant ? variant.price : product.price;
      const itemTotal = unitPrice * item.quantity;
      const itemTax = Math.round(itemTotal * 0.05); // 5% Agri GST

      subtotal += itemTotal;
      tax += itemTax;

      validatedItems.push({
        productId: product.id,
        variantId: variant?.id,
        name: product.name,
        variantTitle: variant?.title || 'Standard',
        sku: variant?.sku || product.sku,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Validate Coupon
    let discount = 0;
    let couponResult = null;
    if (couponCode) {
      const cRes = devDb.validateCoupon(couponCode, subtotal);
      if (cRes.valid) {
        discount = cRes.discount;
      }
      couponResult = cRes;
    }

    // Shipping & Dark Warehouse Serviceability Check
    const cleanPincode = pincode.trim();
    const warehouses = devDb.getWarehouses();
    let assignedWarehouse = warehouses.find((w) => w.servicedPincodes.includes(cleanPincode));
    let isServiceable = true;

    if (!assignedWarehouse) {
      // Fallback to Hubballi Central Hub if not in explicit list
      assignedWarehouse = warehouses[0];
    }

    // Free delivery for orders above ₹10,000; otherwise ₹250 regional dark warehouse express freight
    const deliveryFee = subtotal >= 10000 ? 0 : 250;
    const finalTotal = Math.max(0, subtotal - discount + deliveryFee + tax);

    return NextResponse.json({
      success: true,
      subtotal,
      discount,
      deliveryFee,
      tax,
      total: finalTotal,
      items: validatedItems,
      couponResult,
      warehouseRouting: {
        assignedWarehouse: {
          id: assignedWarehouse.id,
          name: assignedWarehouse.name,
          code: assignedWarehouse.code,
          serviceRadiusKm: assignedWarehouse.serviceRadiusKm,
        },
        pincode: cleanPincode,
        isServiceable,
        estimatedDelivery: subtotal >= 10000 ? '24–48 Hours (Express Hub Freight)' : '2–3 Days Direct Dispatch',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error calculating cart totals' },
      { status: 500 }
    );
  }
}
