import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchKpiData } from '../lib/kpi/fetch';
import { calculateKpiSummary } from '../lib/kpi/calculator';
import type { KpiSummary } from '../lib/kpi/types';
import { KpiCard } from '../components/KpiCard';
import { useStore } from '../contexts/StoreContext';

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
    <>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : kpiData ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiData.cards.map(card => (
            <KpiCard key={card.name} card={card} />
          ))}
        </div>
      ) : null}
    </>
  );
};
