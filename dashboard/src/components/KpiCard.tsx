import { DollarSign, Smartphone, Headphones, Zap, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { CardData } from '../lib/kpi/types';
import { STATUS_THRESHOLDS } from '../lib/kpi/types';

const STATUS_ICON = {
  good: 'text-emerald-500 bg-emerald-50',
  warning: 'text-amber-500 bg-amber-50',
  danger: 'text-rose-500 bg-rose-50',
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

  const isAboveTarget = card.achievementPercent >= STATUS_THRESHOLDS.good;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${STATUS_ICON[card.status.level]}`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="font-semibold text-xs text-gray-600">{card.name}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
          {truncateValue(card.revenue)}
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className={`inline-flex items-center font-semibold ${isAboveTarget ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isAboveTarget ? (
            <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
          )}
          {card.achievementPercent.toFixed(0)}%
        </span>
        <span className="text-gray-400">vs Target {truncateValue(card.target)}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            card.achievementPercent >= 100
              ? 'bg-[#6B4C9A]'
              : card.achievementPercent >= 80
              ? 'bg-purple-400'
              : 'bg-rose-400'
          }`}
          style={{ width: `${Math.min(card.achievementPercent, 100)}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-50">
        <span>Est: {truncateValue(card.estimated)}</span>
        <span className={card.variance >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
          {card.variance >= 0 ? '+' : ''}{truncateValue(card.variance)}
        </span>
      </div>
    </div>
  );
};