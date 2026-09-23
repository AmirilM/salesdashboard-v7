// KPI Types Definition
// Sesuai docs/KPI_Metrics_Definition.md

export interface SalesTransaction {
  id: string;
  localamount: number;
  qty_item: number;
  brand_name: string;
  kpi_group: string;
  store_code: string;
  store_name: string;
  date: string;
}

export interface MasterTarget {
  store_code: string;
  store_name: string;
  target_revenue_total: number;
  target_revenue_apple: number;
  target_revenue_android: number;
  target_revenue_accessories: number;
  target_revenue_vas: number;
}

export interface KpiGroupTotals {
  APPLE: number;
  ANDROID: number;
  ACCESSORIES: number;
  VAS: number;
}

export interface TargetTotals {
  apple: number;
  android: number;
  accessories: number;
  vas: number;
  total: number;
}

export interface StatusResult {
  level: 'good' | 'warning' | 'danger';
  label: string;
}

export interface KpiPerformance {
  name: string;
  achievement: number;
  target: number;
  percent: number;
  status: StatusResult;
}

export interface CardData {
  name: string;
  icon: string;
  target: number;
  revenue: number;
  variance: number;
  achievementPercent: number;
  estimated: number;
  estimatedPercent: number;
  status: StatusResult;
}

export interface StorePerformance {
  store_code: string;
  store_name: string;
  achievement: number;
  target: number;
  percent: number;
  status: StatusResult;
}

export interface KpiSummary {
  totalRevenue: number;
  totalItems: number;
  totalTarget: number;
  totalTransactions: number;
  achievementPercent: number;
  variance: number;
  status: StatusResult;
  kpiGroups: KpiPerformance[];
  stores: StorePerformance[];
  cards: CardData[];
  estimatedRevenue?: number;
  estimatedAchievement?: number;
  timeGone?: number;
}

export const STATUS_THRESHOLDS = {
  good: 100,
  warning: 80,
};

export const KPI_GROUPS = ['APPLE', 'ANDROID', 'ACCESSORIES', 'VAS'] as const;
export type KpiGroup = typeof KPI_GROUPS[number];