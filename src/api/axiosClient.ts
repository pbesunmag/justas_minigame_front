import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'token'
export const USER_STORAGE_KEY = 'joust_user'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl: string = error.config?.url ?? ''
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      window.dispatchEvent(new Event('auth:unauthorized'))

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
