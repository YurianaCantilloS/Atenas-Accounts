/* ============================================================
   CONFIGURACIÓN DE SUPABASE - ATENAS ERP
   ============================================================ */

const SUPABASE_URL = 'https://mvgzofhgtlqyjtylhkhl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OzxgAMu9ENo_3ASV0xjvag_Cms2VpYr';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // la sesión se mantiene abierta entre visitas
    autoRefreshToken: true,    // renueva el token solo
    detectSessionInUrl: true
  }
});
