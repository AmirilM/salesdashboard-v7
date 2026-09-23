import { supabase } from '../supabase';
import type { SalesTransaction, MasterTarget } from './types';

export const fetchSalesTransactions = async (
  limit: number = 1000
): Promise<SalesTransaction[]> => {
  const { data, error } = await supabase
    .from('data_sales_transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as SalesTransaction[];
};

export const fetchMasterTargets = async (): Promise<MasterTarget[]> => {
  const { data, error } = await supabase
    .from('master_target')
    .select('*');

  if (error) throw error;
  return (data || []) as MasterTarget[];
};

export const fetchKpiData = async (limit: number = 1000) => {
  const [sales, targets] = await Promise.all([
    fetchSalesTransactions(limit),
    fetchMasterTargets(),
  ]);

  return { sales, targets };
};