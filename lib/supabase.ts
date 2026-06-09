import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Esto evita que el build falle; si no hay variables, devolvemos un cliente vacío 
    // o simplemente no intentamos crearlo durante el build.
    return createBrowserClient("", ""); 
  }

  return createBrowserClient(url, key)
}