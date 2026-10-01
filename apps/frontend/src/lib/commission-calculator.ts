export interface CommissionTier {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  baseRatePercent: number;
  bonusRatePercent: number; // Applied if target exceeded
  minMonthlyTarget: number;
}

export const DEALER_TIERS: Record<string, CommissionTier> = {
  BRONZE: { tier: 'BRONZE', baseRatePercent: 4.0, bonusRatePercent: 1.0, minMonthlyTarget: 200000 },
  SILVER: { tier: 'SILVER', baseRatePercent: 6.0, bonusRatePercent: 1.5, minMonthlyTarget: 350000 },
  GOLD: { tier: 'GOLD', baseRatePercent: 8.0, bonusRatePercent: 2.0, minMonthlyTarget: 500000 },
  PLATINUM: { tier: 'PLATINUM', baseRatePercent: 9.0, bonusRatePercent: 2.5, minMonthlyTarget: 750000 },
};

export interface CommissionCalculationResult {
  dealerId: string;
  dealerCode: string;
  tier: string;
  actualSales: number;
  targetSales: number;
  achievementPercentage: number;
  isTargetAchieved: boolean;
  baseCommission: number;
  bonusCommission: number;
  totalCommissionEarned: number;
  effectiveCommissionRate: number;
}

export function calculateDealerCommission(
  dealerId: string,
  dealerCode: string,
  tierName: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
  actualSales: number,
  targetSales: number
): CommissionCalculationResult {
  const tierConfig = DEALER_TIERS[tierName] || DEALER_TIERS.SILVER;
  const achievementPercentage = Math.round((actualSales / targetSales) * 100);
  const isTargetAchieved = actualSales >= targetSales;

  const baseCommission = Math.round(actualSales * (tierConfig.baseRatePercent / 100));
  const bonusCommission = isTargetAchieved
    ? Math.round((actualSales - targetSales) * (tierConfig.bonusRatePercent / 100)) + Math.round(actualSales * 0.005)
    : 0;

  const totalCommissionEarned = baseCommission + bonusCommission;
  const effectiveCommissionRate =
    actualSales > 0 ? Math.round((totalCommissionEarned / actualSales) * 1000) / 10 : tierConfig.baseRatePercent;

  return {
    dealerId,
    dealerCode,
    tier: tierName,
    actualSales,
    targetSales,
    achievementPercentage,
    isTargetAchieved,
    baseCommission,
    bonusCommission,
    totalCommissionEarned,
    effectiveCommissionRate,
  };
}
