import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, DollarSign, Activity, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { fetchKpiData } from '../lib/kpi/fetch';
import { calculateKpiSummary } from '../lib/kpi/calculator';
import type { KpiSummary } from '../lib/kpi/types';

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

const KPI_GROUP_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

const getStatusColor = (level: 'good' | 'warning' | 'danger'): string => {
  return STATUS_COLORS.bg[level];
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString('id-ID');
};

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [kpiData, setKpiData] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { sales, targets } = await fetchKpiData(1000);
        const summary = calculateKpiSummary(sales, targets);
        setKpiData(summary);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Brand aggregation - TODO: add to kpi calculator
  const brandChartData: Array<{name: string; total: number}> = [];

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
        ) : kpiData ? (
          <div className="space-y-6">
            {/* KPI Cards with Egresi Status */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1 min-w-0">
                    <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                    <dd className="text-xl font-semibold text-gray-900 break-words">
                      Rp {formatCurrency(kpiData.totalRevenue)}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${getStatusColor(kpiData.status.level)}`}>
                    <AlertCircle className={`h-6 w-6 ${kpiData.status.level === 'danger' ? 'text-red-600' : kpiData.status.level === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1 min-w-0">
                    <dt className="text-sm font-medium text-gray-500">Achievement %</dt>
                    <dd className="text-xl font-semibold text-gray-900">
                      {kpiData.achievementPercent.toFixed(1)}%
                    </dd>
                    <p className={`text-xs font-medium ${kpiData.status.level === 'danger' ? 'text-red-500' : kpiData.status.level === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {kpiData.status.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1 min-w-0">
                    <dt className="text-sm font-medium text-gray-500">Total Target</dt>
                    <dd className="text-xl font-semibold text-gray-900 break-words">
                      Rp {formatCurrency(kpiData.totalTarget)}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${kpiData.variance < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <TrendingUp className={`h-6 w-6 ${kpiData.variance < 0 ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1 min-w-0">
                    <dt className="text-sm font-medium text-gray-500">Variance</dt>
                    <dd className={`text-xl font-semibold break-words ${kpiData.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {kpiData.variance < 0 ? '-' : 'Rp '}{formatCurrency(Math.abs(kpiData.variance))}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Group Egresi Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              {kpiData.kpiGroups.map((kpi, index) => (
                <div key={kpi.name} className="bg-white overflow-hidden shadow rounded-lg p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${getStatusColor(kpi.status.level)}`}>
                      <AlertCircle className={`h-5 w-5 ${kpi.status.level === 'danger' ? 'text-red-600' : kpi.status.level === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1 min-w-0">
                      <dt className="text-sm font-medium text-gray-500">{kpi.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {kpi.percent.toFixed(1)}%
                      </dd>
                      <p className="text-xs text-gray-500 truncate">
                        Rp {formatCurrency(kpi.achievement)} / {formatCurrency(kpi.target)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full ${kpi.percent >= 100 ? 'bg-green-500' : kpi.percent >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(kpi.percent, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1" style={{ color: KPI_GROUP_COLORS[index] }}>
                        ● {kpi.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Brands by Revenue</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brandChartData}>
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
                        data={kpiData.kpiGroups}
                        dataKey="achievement"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent || 0).toFixed(0)}%`}
                      >
                        {kpiData.kpiGroups.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={KPI_GROUP_COLORS[index]} />
                        ))}
                      </Pie>
                      <Legend 
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
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
                    {kpiData.stores.slice(0, 10).map((store) => (
                      <tr key={store.store_code}>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">{store.store_name}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">Rp {formatCurrency(store.target)}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">Rp {formatCurrency(store.achievement)}</td>
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
          </div>
        ) : null}
      </main>
    </div>
  );
};