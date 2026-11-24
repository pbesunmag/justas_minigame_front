import axios from 'axios'

export function extractApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data.trim().length > 0) {
      return data
    }
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message?: unknown }).message
      if (typeof msg === 'string' && msg.trim().length > 0) {
        return msg
      }
    }
    if (!error.response) {
      return 'No se pudo contactar con el servidor del reino (http://localhost:8080).'
    }
  }
  return fallback
}
