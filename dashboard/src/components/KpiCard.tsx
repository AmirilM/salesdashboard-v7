import { DollarSign, Smartphone, Headphones, Zap, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { CardData } from '../lib/kpi/types';

const STATUS_ICON = {
  good: 'text-emerald-500 bg-emerald-50',
  warning: 'text-amber-500 bg-amber-50',
  danger: 'text-rose-500 bg-rose-50',
};

const TREND_COLOR = {
  good: 'text-emerald-500',
  warning: 'text-amber-500',
  danger: 'text-rose-500',
};

const BAR_COLOR = {
  good: 'bg-[#6B4C9A]',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
};

const truncateValue = (value: number): string => {
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString('id-ID');
  if (formatted.length > 15) {
    if (rounded >= 1_000_000_000) {
      return `Rp ${(rounded / 1_000_000_000).toFixed(0)}M`;
    }
    if (rounded >= 1_000_000) {
      return `Rp ${(rounded / 1_000_000).toFixed(0)}Jt`;
    }
  }
  return `Rp ${formatted}`;
};

export const KpiCard = ({ card }: { card: CardData }) => {
  const IconComponent = card.iconName === 'DollarSign' ? DollarSign :
    card.iconName === 'Smartphone' ? Smartphone :
    card.iconName === 'Headphones' ? Headphones : Zap;

  const statusLevel = card.status.level;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-between min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-lg shrink-0 ${STATUS_ICON[statusLevel]}`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="font-semibold text-xs text-gray-600 truncate">{card.name}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-[#1A1A2E] tracking-tight truncate" title={card.revenue.toLocaleString('id-ID')}>
          {truncateValue(card.revenue)}
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 text-xs min-w-0">
        <span className={`inline-flex items-center font-semibold shrink-0 ${TREND_COLOR[statusLevel]}`}>
          {statusLevel === 'danger' ? (
            <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
          )}
          {card.achievementPercent.toFixed(0)}%
        </span>
        <span className="text-gray-400 truncate" title={`Target: ${card.target.toLocaleString('id-ID')}`}>
          vs Tgt {truncateValue(card.target)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3 shrink-0">
        <div
          className={`h-full rounded-full transition-all duration-500 ${BAR_COLOR[statusLevel]}`}
          style={{ width: `${Math.min(card.achievementPercent, 100)}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-50 min-w-0">
        <span className="truncate pr-2" title={`Estimasi: ${card.estimated.toLocaleString('id-ID')}`}>
          Est: {truncateValue(card.estimated)}
        </span>
        <span className={`font-medium shrink-0 ${card.variance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`} title={`Variance: ${card.variance.toLocaleString('id-ID')}`}>
          {card.variance >= 0 ? '+' : ''}{truncateValue(card.variance)}
        </span>
      </div>
    </div>
  );
};