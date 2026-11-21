import { createClient } from '@neondatabase/neon-js'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL

export const neonConfigError =
  !authUrl || !dataApiUrl
    ? 'Faltan VITE_NEON_AUTH_URL y VITE_NEON_DATA_API_URL en el archivo .env.'
    : null

export const neon = neonConfigError
  ? null
  : createClient({
      auth: {
        url: authUrl,
        allowAnonymous: true,
      },
      dataApi: {
        url: dataApiUrl,
      },
    })
