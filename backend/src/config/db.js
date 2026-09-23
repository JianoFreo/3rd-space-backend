import {createClient} from '@supabase/supabase-js';import {ENV} from './env.js';
export const supabase=createClient(ENV.SUPABASE_URL||'https://placeholder.supabase.co',ENV.SUPABASE_SERVICE_ROLE_KEY||'placeholder',{auth:{persistSession:false,autoRefreshToken:false}});
