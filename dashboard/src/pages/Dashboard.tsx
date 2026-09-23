import { useEffect, useState } from 'react';
import { Loader2, Calendar, Sparkles, MoreHorizontal, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { fetchKpiData } from '../lib/kpi/fetch';
import { calculateKpiSummary } from '../lib/kpi/calculator';
import type { KpiSummary } from '../lib/kpi/types';
import { KpiCard } from '../components/KpiCard';
import { useStore } from '../contexts/StoreContext';

const areaData = [
  { name: 'Jan', value: 120 }, { name: 'Feb', value: 140 }, { name: 'Mar', value: 135 },
  { name: 'Apr', value: 180 }, { name: 'May', value: 210 }, { name: 'Jun', value: 195 },
  { name: 'Jul', value: 240 }, { name: 'Aug', value: 220 }, { name: 'Sep', value: 260 },
  { name: 'Oct', value: 271 }, { name: 'Nov', value: 290 }, { name: 'Dec', value: 310 }
];

const barData = [
  { name: 'Mon', value: 240 }, { name: 'Tue', value: 320 }, { name: 'Wed', value: 210 },
  { name: 'Thu', value: 450 }, { name: 'Fri', value: 380 }, { name: 'Sat', value: 250 },
  { name: 'Sun', value: 190 }
];

export const Dashboard = () => {
  const [kpiData, setKpiData] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedStoreCode } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { sales, targets } = await fetchKpiData(1000, selectedStoreCode);
        const summary = calculateKpiSummary(sales, targets);
        setKpiData(summary);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStoreCode]);

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Welcome Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">Welcome Back!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your sales overview, simplified — optimize with confidence.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors border border-gray-100">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Jan 12, 2026 - Feb 12, 2026</span>
          </button>
          
          <button className="flex items-center gap-2 bg-[#6B4C9A] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-purple-800 transition-colors">
            <Sparkles className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#6B4C9A]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
      ) : kpiData ? (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
            {kpiData.cards.map(card => (
              <KpiCard key={card.name} card={card} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Area Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col min-w-0">
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 pr-4">
                  <h3 className="text-gray-400 text-xs font-medium mb-1 truncate">Total Sales</h3>
                  <div className="text-3xl font-bold text-[#1A1A2E] mb-2 truncate" title={kpiData.totalRevenue.toLocaleString('id-ID')}>
                    Rp {kpiData.totalRevenue.toLocaleString('id-ID')}
                  </div>
                  <div className="flex items-center text-xs min-w-0">
                    <span className={`inline-flex items-center shrink-0 font-semibold mr-2 ${kpiData.status.level === 'danger' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {kpiData.status.level === 'danger' ? <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />} 
                      {kpiData.achievementPercent.toFixed(1)}%
                    </span>
                    <span className="text-gray-400 truncate">Achievement against target</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 truncate">
                    <Calendar className="h-3.5 w-3.5" /> Monthly
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B4C9A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6B4C9A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} tickFormatter={(val) => `${(val/1000).toFixed(0)}K`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1A1A2E', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6B4C9A" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col min-w-0">
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 pr-4">
                  <h3 className="text-gray-400 text-xs font-medium mb-1 truncate">Total Transactions</h3>
                  <div className="text-3xl font-bold text-[#1A1A2E] mb-2 truncate" title={kpiData.totalTransactions.toLocaleString('id-ID')}>
                    {kpiData.totalTransactions.toLocaleString('id-ID')}
                  </div>
                  <div className="flex items-center text-xs min-w-0">
                    <span className="inline-flex items-center shrink-0 text-emerald-500 font-semibold mr-2">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> Active
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 shrink-0">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Thu' ? '#6B4C9A' : '#E8E0F0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col min-w-0">
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 pr-4">
                  <h3 className="text-gray-400 text-xs font-medium mb-1 truncate">Total Items Sold</h3>
                  <div className="text-3xl font-bold text-[#1A1A2E] mb-2 truncate" title={kpiData.totalItems.toLocaleString('id-ID')}>
                    {kpiData.totalItems.toLocaleString('id-ID')}
                  </div>
                  <div className="flex items-center text-xs min-w-0">
                    <span className="inline-flex items-center shrink-0 text-emerald-500 font-semibold mr-2">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> High
                    </span>
                    <span className="text-gray-400 truncate">Volume movement</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 truncate">
                    <Calendar className="h-3.5 w-3.5" /> Monthly
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B4C9A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6B4C9A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Area type="monotone" dataKey="value" stroke="#6B4C9A" strokeWidth={3} fillOpacity={1} fill="url(#colorCust)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-[#6B4C9A] to-[#483269] rounded-2xl p-8 shadow-sm flex flex-col justify-center relative overflow-hidden min-w-0">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <TrendingUp className="h-32 w-32 text-white" />
              </div>
              <div className="relative z-10">
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 break-words">
                  Upgrade the Way You Manage Sales
                </h3>
                <p className="text-purple-100 text-sm mb-8 leading-relaxed max-w-[85%] break-words">
                  Gain real-time insights, streamline operations, and drive smarter growth decisions.
                </p>
                <button className="bg-white text-[#6B4C9A] font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm inline-block max-w-full truncate">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
