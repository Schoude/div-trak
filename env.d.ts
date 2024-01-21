/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_TR_CLIENT_ID: string
  readonly VITE_TR_SOCKET_URL: string
  readonly VITE_TR_IMAGE_ASSETS_BASE: string
  readonly VITE_OAUTH_CLIENT_ID: string
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_FINNHUB_API_TOKEN: string
  readonly VITE_ALPHA_VANTAGE_API_TOKEN: string
  readonly VITE_FINNHUB_API_URL: string
  readonly VITE_ALPHA_VANTAGE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
