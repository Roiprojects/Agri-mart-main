import { SEED_WAREHOUSES, WarehouseType } from './seed-data';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface WarehouseAssignmentResult {
  assignedWarehouse: WarehouseType;
  distanceKm: number;
  estimatedDays: number;
  deliveryFee: number;
  serviceable: boolean;
  assignmentMode: 'AUTO' | 'MANUAL';
  method: 'GPS' | 'PINCODE' | 'FALLBACK';
}

export function assignNearestWarehouse(
  userLat?: number,
  userLon?: number,
  pincode?: string
): WarehouseAssignmentResult {
  const activeWarehouses = SEED_WAREHOUSES.filter((w) => w.isActive);

  if (userLat && userLon) {
    let nearest: WarehouseType = activeWarehouses[0];
    let minDistance = Infinity;

    for (const wh of activeWarehouses) {
      const dist = calculateDistanceKm(userLat, userLon, wh.latitude, wh.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = wh;
      }
    }

    const estimatedDays = minDistance <= 30 ? 1 : minDistance <= 70 ? 2 : 3;
    const deliveryFee = minDistance <= 25 ? 0 : Math.min(250, Math.round(minDistance * 2));

    return {
      assignedWarehouse: nearest,
      distanceKm: minDistance,
      estimatedDays,
      deliveryFee,
      serviceable: minDistance <= nearest.serviceRadiusKm * 1.5,
      assignmentMode: 'AUTO',
      method: 'GPS',
    };
  }

  if (pincode) {
    const directMatch = activeWarehouses.find((w) =>
      w.servicedPincodes.includes(pincode)
    );
    if (directMatch) {
      return {
        assignedWarehouse: directMatch,
        distanceKm: 18.5,
        estimatedDays: 1,
        deliveryFee: 0,
        serviceable: true,
        assignmentMode: 'AUTO',
        method: 'PINCODE',
      };
    }

    const prefix = pincode.substring(0, 3);
    const prefixMatch = activeWarehouses.find((w) =>
      w.servicedPincodes.some((p) => p.startsWith(prefix))
    );
    if (prefixMatch) {
      return {
        assignedWarehouse: prefixMatch,
        distanceKm: 42.0,
        estimatedDays: 2,
        deliveryFee: 100,
        serviceable: true,
        assignmentMode: 'AUTO',
        method: 'PINCODE',
      };
    }
  }

  const fallback = activeWarehouses[0];
  return {
    assignedWarehouse: fallback,
    distanceKm: 65.0,
    estimatedDays: 3,
    deliveryFee: 150,
    serviceable: true,
    assignmentMode: 'AUTO',
    method: 'FALLBACK',
  };
}
