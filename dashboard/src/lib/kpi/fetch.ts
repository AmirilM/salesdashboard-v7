import { supabase } from '../supabase';
import type { SalesTransaction, MasterTarget } from './types';

export const fetchSalesTransactions = async (
  limit: number = 1000,
  storeCode?: string | null
): Promise<SalesTransaction[]> => {
  let query = supabase
    .from('data_sales_transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (storeCode) {
    query = query.eq('store_code', storeCode);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as SalesTransaction[];
};

export const fetchMasterTargets = async (
  storeCode?: string | null
): Promise<MasterTarget[]> => {
  let query = supabase
    .from('master_target')
    .select('*');

  if (storeCode) {
    query = query.eq('store_code', storeCode);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as MasterTarget[];
};

export const fetchKpiData = async (
  limit: number = 1000,
  storeCode?: string | null
) => {
  const [sales, targets] = await Promise.all([
    fetchSalesTransactions(limit, storeCode),
    fetchMasterTargets(storeCode),
  ]);

  return { sales, targets };
};