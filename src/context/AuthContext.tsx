import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginRequest, registerRequest } from '../api/authApi'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/axiosClient'

interface AuthContextValue {
  user: string | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem(USER_STORAGE_KEY),
  )

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => clearSession()
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [clearSession])

  const persistSession = useCallback((nextToken: string, nextUser: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    localStorage.setItem(USER_STORAGE_KEY, nextUser)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await loginRequest({ username, password })
      persistSession(response.token, response.username)
    },
    [persistSession],
  )

  const register = useCallback(
    async (username: string, password: string) => {
      const response = await registerRequest({ username, password })
      persistSession(response.token, response.username)
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return ctx
}
