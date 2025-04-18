import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAllTastings() {
  const { data, error } = await supabase
    .from('tasting_records')
    .select('*')
    .order('tasting_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTasting(recordId: string) {
  const { data, error } = await supabase
    .from('tasting_records')
    .select('*')
    .eq('id', recordId)
    .single();
  if (error) throw error;
  return data;
}
