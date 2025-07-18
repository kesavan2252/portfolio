import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🔹 TABLE NAME: "vault_logs"

// 🔹 Fetch vault logs (ordered by pinned first then date desc)
export const fetchVaultLogs = async () => {
  const { data, error } = await supabase
    .from('vault_logs')
    .select('*')
    .order('pinned', { ascending: false })
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// 🔹 Add new entry
export const addVaultLog = async (entry) => {
  const { data, error } = await supabase.from('vault_logs').insert([entry]);
  if (error) throw error;
  return data;
};

// 🔹 Update entry
export const updateVaultLog = async (id, updatedData) => {
  const { data, error } = await supabase
    .from('vault_logs')
    .update(updatedData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

// 🔹 Delete entry
export const deleteVaultLog = async (id) => {
  const { error } = await supabase.from('vault_logs').delete().eq('id', id);
  if (error) throw error;
};

// 🔹 Fetch messages from the messages table
export const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
