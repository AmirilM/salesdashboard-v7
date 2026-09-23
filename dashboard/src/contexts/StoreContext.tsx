import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Store {
  store_code: string;
  store_name: string;
}

interface StoreContextType {
  stores: Store[];
  selectedStoreCode: string | null;
  setSelectedStoreCode: (code: string | null) => void;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreCode, setSelectedStoreCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Fetch ALL stores from master_target first (to ensure complete list)
        const { data: targetData, error: targetError } = await supabase
          .from('master_target')
          .select('store_code, store_name')
          .order('store_code');

        if (targetError) throw targetError;

        // Fetch unique store names from data_sales_transactions (UPPERCASE format)
        const { data: salesData, error: salesError } = await supabase
          .from('data_sales_transactions')
          .select('store_code, store_name');

        if (salesError) throw salesError;

        // Build map of store_code -> UPPERCASE store_name from sales
        const salesStoreNames = new Map<string, string>();
        (salesData || []).forEach(item => {
          if (item.store_name && !salesStoreNames.has(item.store_code)) {
            salesStoreNames.set(item.store_code, item.store_name);
          }
        });

        // Build complete store list sorted by store_code ASC
        const storeList: Store[] = (targetData || []).map(item => ({
          store_code: item.store_code,
          store_name: salesStoreNames.get(item.store_code) || item.store_name,
        })).sort((a, b) => a.store_code.localeCompare(b.store_code));

        setStores(storeList);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <StoreContext.Provider value={{ stores, selectedStoreCode, setSelectedStoreCode, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};