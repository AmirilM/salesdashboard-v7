import { DollarSign, Smartphone, Headphones, Zap } from 'lucide-react';
import type { CardData } from '../lib/kpi/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Smartphone,
  Headphones,
  Zap,
};

const STATUS_BG = {
  good: 'bg-green-50 border-green-200',
  warning: 'bg-yellow-50 border-yellow-200',
  danger: 'bg-red-50 border-red-200',
};

const STATUS_TEXT = {
  good: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
};

const STATUS_ICON = {
  good: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-600',
};

const truncateValue = (value: number): string => {
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString('id-ID');
  // If too long, use abbreviated format
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
  const IconComponent = iconMap[card.iconName] || DollarSign;

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${STATUS_BG[card.status.level]} p-4 flex flex-col gap-2`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded ${STATUS_ICON[card.status.level]} flex-shrink-0`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="font-bold text-xs text-gray-800 truncate">{card.name}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BG[card.status.level]} ${STATUS_TEXT[card.status.level]}`}>
          {card.achievementPercent.toFixed(0)}%
        </span>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-1.5 text-[11px] flex-1 justify-center">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Target</span>
          <span className="text-gray-900 font-semibold whitespace-nowrap">{truncateValue(card.target)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Revenue</span>
          <span className="text-gray-900 font-semibold whitespace-nowrap">{truncateValue(card.revenue)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Variance</span>
          <span className={`font-semibold whitespace-nowrap ${card.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {card.variance < 0 ? '-' : '+'}{truncateValue(Math.abs(card.variance))}
          </span>
        </div>
        <div className="border-t border-gray-100 my-0.5"></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Estimasi</span>
          <span className="text-blue-600 font-semibold whitespace-nowrap">{truncateValue(card.estimated)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Est. %</span>
          <span className="text-blue-600 font-semibold">{card.estimatedPercent.toFixed(0)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-auto pt-1">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              card.achievementPercent >= 100 ? 'bg-green-500' :
              card.achievementPercent >= 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(card.achievementPercent, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};