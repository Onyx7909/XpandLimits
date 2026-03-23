import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvjmubzawkxalvszigrr.supabase.co';
const supabaseAnonKey = 'sb_publishable_4sfm7B7CnMetQ-3kVOPnAQ_yVJeG_dP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
