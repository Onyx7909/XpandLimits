import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://pvjmubzawkxalvszigrr.supabase.co';
const supabaseAnonKey = 'sb_publishable_4sfm7B7CnMetQ-3kVOPnAQ_yVJeG_dP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
