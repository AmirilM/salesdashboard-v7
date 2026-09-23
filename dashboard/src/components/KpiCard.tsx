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

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const KpiCard = ({ card }: { card: CardData }) => {
  const IconComponent = iconMap[card.iconName] || DollarSign;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${STATUS_BG[card.status.level]} p-4 flex flex-col justify-between`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-gray-600" />
          <span className="font-bold text-sm text-gray-700 uppercase">{card.name}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BG[card.status.level]} ${STATUS_TEXT[card.status.level]}`}>
          {card.achievementPercent.toFixed(1)}%
        </span>
      </div>

      {/* Metrics */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-gray-500">
          <span>Target</span>
          <span className="text-gray-800 font-medium">{formatCurrency(card.target)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Revenue</span>
          <span className="text-gray-800 font-medium">{formatCurrency(card.revenue)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Variance</span>
          <span className={`font-medium ${card.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {card.variance < 0 ? '-' : '+'}{formatCurrency(Math.abs(card.variance))}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Estimated</span>
          <span className="text-blue-600 font-medium">{formatCurrency(card.estimated)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Est. %</span>
          <span className="text-blue-600 font-medium">{card.estimatedPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
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