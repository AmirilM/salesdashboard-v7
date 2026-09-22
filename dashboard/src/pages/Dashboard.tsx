import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, DollarSign, ShoppingCart, Activity, Loader2 } from 'lucide-react';
import type { SalesTransaction } from '../types/sales';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<SalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ponytail: Fetch latest 1000 rows. Add Supabase RPC/View for full 17k row aggregation later.
    const fetchData = async () => {
      const { data: sales, error } = await supabase
        .from('data_sales_transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(1000);

      if (error) setError(error.message);
      else setData(sales || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalRevenue = data.reduce((sum, item) => sum + Number(item.localamount), 0);
  const totalItems = data.reduce((sum, item) => sum + Number(item.qty_item), 0);

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
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue (1k Latest)</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      Rp {totalRevenue.toLocaleString('id-ID')}
                    </dd>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Items Sold</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{totalItems.toLocaleString('id-ID')}</dd>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{data.length}</dd>
                  </div>
                </div>
              </div>
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

              {/* Table */}
              <div className="bg-white shadow rounded-lg p-6 lg:col-span-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                <div className="overflow-y-auto flex-1 max-h-72">
                  <ul className="divide-y divide-gray-200">
                    {data.slice(0, 10).map((trx) => (
                      <li key={trx.id} className="py-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate pr-4">{trx.item}</p>
                          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            Rp {Number(trx.localamount).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{trx.store_name}</p>
                          <p className="text-xs text-gray-500">{trx.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
