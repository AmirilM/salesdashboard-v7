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
        // Fetch unique store_code + store_name from data_sales_transactions (UPPERCASE format)
        const { data, error } = await supabase
          .from('data_sales_transactions')
          .select('store_code, store_name')
          .order('store_name');

        if (error) throw error;

        // Deduplicate by store_code (keep first occurrence which has UPPERCASE name)
        const uniqueStores = new Map<string, string>();
        (data || []).forEach(item => {
          if (!uniqueStores.has(item.store_code)) {
            uniqueStores.set(item.store_code, item.store_name);
          }
        });

        const storeList: Store[] = Array.from(uniqueStores.entries()).map(([code, name]) => ({
          store_code: code,
          store_name: name,
        }));

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