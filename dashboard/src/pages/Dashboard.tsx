import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchKpiData } from '../lib/kpi/fetch';
import { calculateKpiSummary } from '../lib/kpi/calculator';
import type { KpiSummary } from '../lib/kpi/types';
import { KpiCard } from '../components/KpiCard';

export const Dashboard = () => {
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

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : kpiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.cards.map(card => (
            <KpiCard key={card.name} card={card} />
          ))}
        </div>
      ) : null}
    </>
  );
};
