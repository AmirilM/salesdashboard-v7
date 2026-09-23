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

const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const KpiCard = ({ card }: { card: CardData }) => {
  const IconComponent = iconMap[card.iconName] || DollarSign;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${STATUS_BG[card.status.level]} p-5 flex flex-col gap-4 min-h-[280px]`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${STATUS_ICON[card.status.level]}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <span className="font-bold text-base text-gray-800 tracking-wide">{card.name}</span>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${STATUS_BG[card.status.level]} ${STATUS_TEXT[card.status.level]}`}>
          {card.achievementPercent.toFixed(1)}%
        </span>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3 text-sm flex-1 justify-center">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Target</span>
          <span className="text-gray-900 font-semibold whitespace-nowrap">{formatCurrency(card.target)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Revenue</span>
          <span className="text-gray-900 font-semibold whitespace-nowrap">{formatCurrency(card.revenue)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Variance</span>
          <span className={`font-semibold whitespace-nowrap ${card.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {card.variance < 0 ? '-' : '+'}{formatCurrency(Math.abs(card.variance))}
          </span>
        </div>
        <div className="border-t border-gray-100 my-1"></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Estimated</span>
          <span className="text-blue-600 font-semibold whitespace-nowrap">{formatCurrency(card.estimated)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Est. %</span>
          <span className="text-blue-600 font-semibold">{card.estimatedPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
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