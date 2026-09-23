import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, DollarSign, Activity, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import type { SalesTransaction } from '../types/sales';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface MasterTarget {
  store_code: string;
  store_name: string;
  target_revenue_total: number;
  target_revenue_apple: number;
  target_revenue_android: number;
  target_revenue_accessories: number;
  target_revenue_vas: number;
}

interface KpiGroupTotals {
  APPLE: number;
  ANDROID: number;
  ACCESSORIES: number;
  VAS: number;
}

interface TargetTotals {
  apple: number;
  android: number;
  accessories: number;
  vas: number;
  total: number;
}

interface StatusResult {
  level: 'good' | 'warning' | 'danger';
  label: string;
}

interface KpiPerformance {
  name: string;
  achievement: number;
  target: number;
  percent: number;
}

interface StorePerformance {
  store_code: string;
  store_name: string;
  achievement: number;
  target: number;
  percent: number;
}

const STATUS_COLORS = {
  good: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  bg: {
    good: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
  }
};

const getStatus = (percent: number): StatusResult => {
  if (percent >= 100) return { level: 'good', label: 'Target Capai' };
  if (percent >= 80) return { level: 'warning', label: 'Dekat Target' };
  return { level: 'danger', label: 'Egresi' };
};

const getStatusColor = (level: 'good' | 'warning' | 'danger'): string => {
  return STATUS_COLORS.bg[level];
};

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<SalesTransaction[]>([]);
  const [targets, setTargets] = useState<MasterTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales transactions
        const { data: sales, error: salesError } = await supabase
          .from('data_sales_transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(1000);

        if (salesError) throw salesError;

        // Fetch master targets
        const { data: tgt, error: targetError } = await supabase
          .from('master_target')
          .select('*');

        if (targetError) throw targetError;

        setData(sales || []);
        setTargets(tgt || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculations
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.localamount), 0);

  // KPI Group totals from actual data
  const kpiGroupTotals: KpiGroupTotals = {
    APPLE: 0,
    ANDROID: 0,
    ACCESSORIES: 0,
    VAS: 0
  };

  data.forEach(item => {
    const kpiGroup = item.kpi_group?.toUpperCase() || '';
    if (kpiGroup in kpiGroupTotals) {
      kpiGroupTotals[kpiGroup as keyof KpiGroupTotals] += Number(item.localamount);
    }
  });

  // Target totals
  const targetTotals: TargetTotals = {
    apple: targets.reduce((sum, t) => sum + Number(t.target_revenue_apple || 0), 0),
    android: targets.reduce((sum, t) => sum + Number(t.target_revenue_android || 0), 0),
    accessories: targets.reduce((sum, t) => sum + Number(t.target_revenue_accessories || 0), 0),
    vas: targets.reduce((sum, t) => sum + Number(t.target_revenue_vas || 0), 0),
    total: 0
  };
  targetTotals.total = targetTotals.apple + targetTotals.android + targetTotals.accessories + targetTotals.vas;

  // Egresi calculations
  const achievementPercent = targetTotals.total > 0 ? (totalRevenue / targetTotals.total) * 100 : 0;
  const variance = totalRevenue - targetTotals.total;
  const currentStatus = getStatus(achievementPercent);

  // KPI Group performance
  const kpiGroupPerformance: KpiPerformance[] = [
    {
      name: 'APPLE',
      achievement: kpiGroupTotals.APPLE,
      target: targetTotals.apple,
      percent: targetTotals.apple > 0 ? (kpiGroupTotals.APPLE / targetTotals.apple) * 100 : 0
    },
    {
      name: 'ANDROID',
      achievement: kpiGroupTotals.ANDROID,
      target: targetTotals.android,
      percent: targetTotals.android > 0 ? (kpiGroupTotals.ANDROID / targetTotals.android) * 100 : 0
    },
    {
      name: 'ACCESSORIES',
      achievement: kpiGroupTotals.ACCESSORIES,
      target: targetTotals.accessories,
      percent: targetTotals.accessories > 0 ? (kpiGroupTotals.ACCESSORIES / targetTotals.accessories) * 100 : 0
    },
    {
      name: 'VAS',
      achievement: kpiGroupTotals.VAS,
      target: targetTotals.vas,
      percent: targetTotals.vas > 0 ? (kpiGroupTotals.VAS / targetTotals.vas) * 100 : 0
    }
  ];

  // Aggregate revenue by brand
  const brandData = data.reduce((acc, curr) => {
    const brand = curr.brand_name || 'Unknown';
    acc[brand] = (acc[brand] || 0) + Number(curr.localamount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(brandData)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Store-level achievement
  const storeLevelData: StorePerformance[] = targets.map(target => {
    const storeTransactions = data.filter(t => t.store_code === target.store_code);
    const storeAchievement = storeTransactions.reduce((sum, t) => sum + Number(t.localamount), 0);
    const storeTarget = Number(target.target_revenue_total || 0);
    const storePercent = storeTarget > 0 ? (storeAchievement / storeTarget) * 100 : 0;
    
    return {
      store_code: target.store_code,
      store_name: target.store_name,
      achievement: storeAchievement,
      target: storeTarget,
      percent: storePercent
    };
  }).sort((a, b) => b.percent - a.percent);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Sales Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={signOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards with Egresi Status */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      Rp {totalRevenue.toLocaleString('id-ID')}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${getStatusColor(currentStatus.level)}`}>
                    <AlertCircle className={`h-6 w-6 ${currentStatus.level === 'danger' ? 'text-red-600' : currentStatus.level === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Achievement %</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {achievementPercent.toFixed(1)}%
                    </dd>
                    <p className="text-xs text-gray-500">{currentStatus.label}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Target</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      Rp {targetTotals.total.toLocaleString('id-ID')}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${variance < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <TrendingUp className={`h-6 w-6 ${variance < 0 ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Variance</dt>
                    <dd className={`text-2xl font-semibold ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {variance < 0 ? '-' : 'Rp '}{Math.abs(variance).toLocaleString('id-ID')}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Group Egresi Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              {kpiGroupPerformance.map((kpi) => {
                const kpiStatus = getStatus(kpi.percent);
                return (
                <div key={kpi.name} className="bg-white overflow-hidden shadow rounded-lg p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${getStatusColor(kpiStatus.level)}`}>
                      <AlertCircle className={`h-5 w-5 ${kpiStatus.level === 'danger' ? 'text-red-600' : kpiStatus.level === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">{kpi.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {kpi.percent.toFixed(1)}%
                      </dd>
                      <p className="text-xs text-gray-400">
                        Rp {kpi.achievement.toLocaleString('id-ID')} / {kpi.target.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Brands by Revenue</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(val: any) => `Rp ${(val ?? 0).toLocaleString('id-ID')}`} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI Group Distribution */}
              <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">KPI Group Performance</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kpiGroupPerformance}
                        dataKey="achievement"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent || 0).toFixed(0)}%`}
                      >
                        {kpiGroupPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.percent >= 100 ? '#22c55e' : entry.percent >= 80 ? '#eab308' : '#ef4444'} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Target vs Achievement Table */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-gray-500" />
                Store Performance - Target vs Achievement
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Target</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Achievement</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {storeLevelData.slice(0, 10).map((store) => (
                      <tr key={store.store_code}>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">{store.store_name}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">Rp {store.target.toLocaleString('id-ID')}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">Rp {store.achievement.toLocaleString('id-ID')}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${store.percent >= 100 ? 'bg-green-500' : store.percent >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(store.percent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{store.percent.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
              <div className="overflow-y-auto max-h-72">
                <ul className="divide-y divide-gray-200">
                  {data.slice(0, 10).map((trx) => (
                    <li key={trx.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trx.item}</p>
                        <p className="text-xs text-gray-500">{trx.store_name} • {trx.kpi_group}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        Rp {Number(trx.localamount).toLocaleString('id-ID')}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};