import type {
  SalesTransaction,
  MasterTarget,
  KpiGroupTotals,
  TargetTotals,
  StatusResult,
  KpiPerformance,
  CardData,
  StorePerformance,
  KpiSummary,
} from './types';
import { STATUS_THRESHOLDS, KPI_GROUPS } from './types';

export const getStatus = (percent: number): StatusResult => {
  if (percent >= STATUS_THRESHOLDS.good) {
    return { level: 'good', label: 'Target Capai' };
  }
  if (percent >= STATUS_THRESHOLDS.warning) {
    return { level: 'warning', label: 'Dekat Target' };
  }
  return { level: 'danger', label: 'Di Bawah Target' };
};

export const calculateKpiGroupTotals = (data: SalesTransaction[]): KpiGroupTotals => {
  const totals: KpiGroupTotals = {
    APPLE: 0,
    ANDROID: 0,
    ACCESSORIES: 0,
    VAS: 0,
  };

  data.forEach(item => {
    const kpiGroup = item.kpi_group?.toUpperCase() || '';
    if (kpiGroup in totals) {
      totals[kpiGroup as keyof KpiGroupTotals] += Number(item.localamount || 0);
    }
  });

  return totals;
};

export const calculateTargetTotals = (targets: MasterTarget[]): TargetTotals => {
  const totals: TargetTotals = {
    apple: targets.reduce((sum, t) => sum + Number(t.target_revenue_apple || 0), 0),
    android: targets.reduce((sum, t) => sum + Number(t.target_revenue_android || 0), 0),
    accessories: targets.reduce((sum, t) => sum + Number(t.target_revenue_accessories || 0), 0),
    vas: targets.reduce((sum, t) => sum + Number(t.target_revenue_vas || 0), 0),
    total: 0,
  };
  totals.total = totals.apple + totals.android + totals.accessories + totals.vas;
  return totals;
};

export const calculateKpiGroupPerformance = (
  kpiGroupTotals: KpiGroupTotals,
  targetTotals: TargetTotals
): KpiPerformance[] => {
  const groupMapping: Record<string, number> = {
    APPLE: targetTotals.apple,
    ANDROID: targetTotals.android,
    ACCESSORIES: targetTotals.accessories,
    VAS: targetTotals.vas,
  };

  return KPI_GROUPS.map(name => {
    const achievement = kpiGroupTotals[name];
    const target = groupMapping[name] || 0;
    const percent = target > 0 ? (achievement / target) * 100 : 0;

    return {
      name,
      achievement,
      target,
      percent,
      status: getStatus(percent),
    };
  });
};

export const calculateStorePerformance = (
  data: SalesTransaction[],
  targets: MasterTarget[]
): StorePerformance[] => {
  return targets
    .map(target => {
      const storeTransactions = data.filter(t => t.store_code === target.store_code);
      const achievement = storeTransactions.reduce(
        (sum, t) => sum + Number(t.localamount || 0),
        0
      );
      const targetValue = Number(target.target_revenue_total || 0);
      const percent = targetValue > 0 ? (achievement / targetValue) * 100 : 0;

      return {
        store_code: target.store_code,
        store_name: target.store_name,
        achievement,
        target: targetValue,
        percent,
        status: getStatus(percent),
      };
    })
    .sort((a, b) => b.percent - a.percent);
};

export const calculateEstimatedRevenue = (
  actualRevenue: number,
  currentDate: Date
): number => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const currentDay = currentDate.getDate();
  if (currentDay <= 0) return actualRevenue;
  return (actualRevenue / currentDay) * daysInMonth;
};

export const calculateTimeGone = (currentDate: Date): number => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const currentDay = currentDate.getDate();
  if (daysInMonth <= 0) return 0;
  return ((currentDay - 1) / daysInMonth) * 100;
};

export const calculateKpiSummary = (
  data: SalesTransaction[],
  targets: MasterTarget[],
  currentDate: Date = new Date()
): KpiSummary => {
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.localamount || 0), 0);
  const totalItems = data.reduce((sum, item) => sum + Number(item.qty_item || 0), 0);
  const totalTransactions = data.length;

  const kpiGroupTotals = calculateKpiGroupTotals(data);
  const targetTotals = calculateTargetTotals(targets);

  const achievementPercent = targetTotals.total > 0
    ? (totalRevenue / targetTotals.total) * 100
    : 0;
  const variance = totalRevenue - targetTotals.total;

  const estimatedRevenue = calculateEstimatedRevenue(totalRevenue, currentDate);
  const estimatedAchievement = targetTotals.total > 0
    ? (estimatedRevenue / targetTotals.total) * 100
    : 0;
  const timeGone = calculateTimeGone(currentDate);

  return {
    totalRevenue,
    totalItems,
    totalTarget: targetTotals.total,
    totalTransactions,
    achievementPercent,
    variance,
    status: getStatus(achievementPercent),
    kpiGroups: calculateKpiGroupPerformance(kpiGroupTotals, targetTotals),
    stores: calculateStorePerformance(data, targets),
    cards: calculateCardData(data, targets, currentDate),
    estimatedRevenue,
    estimatedAchievement,
    timeGone,
  };
};

export const calculateCardData = (
  data: SalesTransaction[],
  targets: MasterTarget[],
  currentDate: Date = new Date()
): CardData[] => {
  const kpiGroupTotals = calculateKpiGroupTotals(data);
  const targetTotals = calculateTargetTotals(targets);
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.localamount || 0), 0);

  const cardConfigs = [
    { name: 'TOTAL', iconName: 'DollarSign', getRevenue: () => totalRevenue, getTarget: () => targetTotals.total },
    { name: 'APPLE', iconName: 'Smartphone', getRevenue: () => kpiGroupTotals.APPLE, getTarget: () => targetTotals.apple },
    { name: 'ANDROID', iconName: 'Smartphone', getRevenue: () => kpiGroupTotals.ANDROID, getTarget: () => targetTotals.android },
    { name: 'ACCESSORIES', iconName: 'Headphones', getRevenue: () => kpiGroupTotals.ACCESSORIES, getTarget: () => targetTotals.accessories },
    { name: 'VAS', iconName: 'Zap', getRevenue: () => kpiGroupTotals.VAS, getTarget: () => targetTotals.vas },
  ];

  return cardConfigs.map(config => {
    const revenue = config.getRevenue();
    const target = config.getTarget();
    const variance = revenue - target;
    const achievementPercent = target > 0 ? (revenue / target) * 100 : 0;
    const estimated = calculateEstimatedRevenue(revenue, currentDate);
    const estimatedPercent = target > 0 ? (estimated / target) * 100 : 0;

    return {
      name: config.name,
      iconName: config.iconName,
      target,
      revenue,
      variance,
      achievementPercent,
      estimated,
      estimatedPercent,
      status: getStatus(achievementPercent),
    };
  });
};