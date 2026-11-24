import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelPanel } from '../components/ui/PixelPanel'
import { TournamentCrestSprite } from '../components/ui/PixelSprites'
import { useAuth } from '../context/AuthContext'

type AuthTab = 'login' | 'register'

export function LoginPage() {
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<AuthTab>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/saves" replace />
  }

  const handleTabChange = (nextTab: AuthTab) => {
    setTab(nextTab)
    setError(null)
    setConfirmPassword('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedUser = username.trim()
    const trimmedPass = password.trim()

    if (!trimmedUser || !trimmedPass) {
      setError('Debes introducir un nombre de caballero y una contraseña.')
      return
    }

    if (tab === 'register' && trimmedPass !== confirmPassword.trim()) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      if (tab === 'login') {
        await login(trimmedUser, trimmedPass)
      } else {
        await register(trimmedUser, trimmedPass)
      }
      navigate('/saves', { replace: true })
    } catch (err) {
      setError(
        extractApiError(
          err,
          tab === 'login'
            ? 'Credenciales inválidas. Revisa tu usuario y contraseña.'
            : 'No se pudo forjar la cuenta. Intenta con otro nombre.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pixel-bg-pattern flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Cabecera de título RPG clásico */}
      <header className="mb-6 flex flex-col items-center text-center max-w-2xl">
        <div className="mb-4 border-4 border-[#140e0a] bg-[#3d2e22] p-3 shadow-[4px_4px_0px_#140e0a]">
          <TournamentCrestSprite className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        <p className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-[#d4af37] tracking-[0.2em] uppercase mb-2 pixel-text-shadow-sm">
          GRAN TORNEO DEL REINO
        </p>
        <h1 className="font-[var(--font-pixel)] text-xl sm:text-3xl text-[#f4e6c8] tracking-wider uppercase pixel-text-shadow leading-relaxed">
          JUSTAS MEDIEVALES
        </h1>
        <p className="mt-2 font-[var(--font-retro)] text-2xl text-[#c8b698]">
          Alza tu lanza, conquista la arena y forja tu leyenda.
        </p>
      </header>

      {/* Ventana de acceso */}
      <main className="w-full max-w-lg">
        <PixelPanel>
          {/* Pestañas */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <PixelButton
              type="button"
              variant={tab === 'login' ? 'gold' : 'primary'}
              onClick={() => handleTabChange('login')}
              fullWidth
            >
              Iniciar Sesión
            </PixelButton>
            <PixelButton
              type="button"
              variant={tab === 'register' ? 'gold' : 'primary'}
              onClick={() => handleTabChange('register')}
              fullWidth
            >
              Forjar Cuenta
            </PixelButton>
          </div>

          <div className="mb-4 border-b-4 border-[#5c4033] pb-3">
            <h2 className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#d4af37] uppercase pixel-text-shadow-sm">
              {tab === 'login' ? 'Puertas del Campamento' : 'Juramento de Nuevo Escudero'}
            </h2>
            <p className="mt-1 font-[var(--font-retro)] text-xl text-[#c8b698]">
              {tab === 'login'
                ? 'Identifícate para consultar tus pergaminos de campaña.'
                : 'Registra tu linaje para guardar tus hazañas en el reino.'}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 border-4 border-[#140e0a] bg-[#b8292f] px-4 py-3 text-[#f4e6c8] shadow-[3px_3px_0px_#140e0a]"
            >
              <p className="font-[var(--font-retro)] text-xl leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2"
              >
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="pixel-input"
                placeholder="Ej. SirGawain"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                className="pixel-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            {tab === 'register' && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2"
                >
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="pixel-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                />
              </div>
            )}

            <div className="pt-2">
              <PixelButton
                type="submit"
                variant="gold"
                size="lg"
                fullWidth
                disabled={submitting}
              >
                {submitting
                  ? 'Consultando al Heraldo...'
                  : tab === 'login'
                    ? 'Entrar al Torneo'
                    : 'Forjar Cuenta'}
              </PixelButton>
            </div>
          </form>
        </PixelPanel>

        <p className="mt-5 text-center font-[var(--font-retro)] text-xl text-[#8c7860]">
          Reino conectado en http://localhost:8080/api
        </p>
      </main>
    </div>
  )
}
