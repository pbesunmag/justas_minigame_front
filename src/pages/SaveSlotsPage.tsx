import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { deleteSave, getSaves } from '../api/savesApi'
import { PixelButton } from '../components/ui/PixelButton'
import {
  PixelKnightAvatar,
  resolveArmorColor,
} from '../components/ui/PixelKnightAvatar'
import { PixelPanel } from '../components/ui/PixelPanel'
import {
  CoinIcon,
  SkullIcon,
  TournamentCrestSprite,
} from '../components/ui/PixelSprites'
import { useAuth } from '../context/AuthContext'
import type { SaveGameSummary } from '../types/api'

export function SaveSlotsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [saves, setSaves] = useState<SaveGameSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const fetchSaves = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await getSaves()
      setSaves(list)
    } catch (err) {
      setError(extractApiError(err, 'No se pudieron recuperar tus pergaminos de partida.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSaves()
  }, [fetchSaves])

  const handleDeleteSave = async (saveId: number) => {
    setError(null)
    setDeletingId(saveId)
    try {
      await deleteSave(saveId)
      setSaves((prev) => prev.filter((item) => item.id !== saveId))
      setConfirmDeleteId(null)
    } catch (err) {
      setError(extractApiError(err, 'No se pudo quemar el pergamino de partida.'))
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen pixel-bg-pattern p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Barra superior */}
        <PixelPanel variant="dark" bodyClassName="py-4 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <TournamentCrestSprite className="w-12 h-12 shrink-0" />
              <div>
                <h1 className="font-[var(--font-pixel)] text-sm sm:text-lg text-[#d4af37] uppercase pixel-text-shadow-sm">
                  Pergaminos del Reino
                </h1>
                <p className="font-[var(--font-retro)] text-2xl text-[#c8b698]">
                  Cuenta activa: <span className="text-[#f4e6c8]">{user ?? 'Caballero'}</span>
                </p>
              </div>
            </div>

            <PixelButton variant="danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </PixelButton>
          </div>
        </PixelPanel>

        {/* Botón principal de Nueva Partida (Flujo narrativo con Cassian) */}
        <PixelPanel
          title="Iniciar Nueva Campaña"
          subtitle="Vive el prólogo en Valdecruz, personaliza a tu caballero, recibe tus 3 armas y elige tu corcel."
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
              Cassian te espera a las puertas del pueblo para guiarte en tu inscripción al Gran Torneo.
            </p>
            <PixelButton
              variant="gold"
              size="lg"
              onClick={() => navigate('/new-game')}
              className="shrink-0"
            >
              + Nueva Partida
            </PixelButton>
          </div>
        </PixelPanel>

        {error && (
          <div
            role="alert"
            className="border-4 border-[#140e0a] bg-[#b8292f] px-4 py-3 text-[#f4e6c8] shadow-[4px_4px_0px_#140e0a]"
          >
            <p className="font-[var(--font-retro)] text-2xl">{error}</p>
          </div>
        )}

        {/* Listado de partidas guardadas */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#f4e6c8] uppercase pixel-text-shadow-sm">
              Escudos Guardados ({saves.length})
            </h2>
            <PixelButton variant="primary" size="sm" onClick={() => void fetchSaves()}>
              Recargar
            </PixelButton>
          </div>

          {loading ? (
            <PixelPanel>
              <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] text-center py-8">
                Desenrollando pergaminos...
              </p>
            </PixelPanel>
          ) : saves.length === 0 ? (
            <PixelPanel>
              <div className="text-center py-8 space-y-2">
                <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] uppercase">
                  No hay caballeros registrados
                </p>
                <p className="font-[var(--font-retro)] text-2xl text-[#c8b698]">
                  Pulsa «+ Nueva Partida» arriba para comenzar tu aventura con Cassian.
                </p>
              </div>
            </PixelPanel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {saves.map((save) => {
                const bossesCount = save.defeatedBosses?.length ?? 0
                const isConfirming = confirmDeleteId === save.id
                const isDeleting = deletingId === save.id

                return (
                  <PixelPanel
                    key={save.id}
                    className="h-full"
                    bodyClassName="flex flex-col justify-between gap-4 h-full"
                  >
                    <div className="space-y-4">
                      {/* Cabecera heráldica con avatar dinámico */}
                      <div className="flex items-start justify-between gap-3 border-b-4 border-[#5c4033] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="border-4 border-[#140e0a] bg-[#d4af37] p-0.5 shrink-0">
                            <PixelKnightAvatar
                              bodyType={save.bodyType}
                              skinTone={save.skinTone}
                              hairStyle={save.hairStyle}
                              hairColor={save.hairColor}
                              armorColor={resolveArmorColor(save.armorId)}
                              className="w-14 h-14"
                            />
                          </div>
                          <div>
                            <h3 className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#f4e6c8] uppercase pixel-text-shadow-sm break-words">
                              {save.knightName}
                            </h3>
                            <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">
                              Montura: <span className="text-[#d4af37]">{save.horseName || 'Rocín'}</span> · #{save.id}
                            </p>
                          </div>
                        </div>

                        <span className="border-4 border-[#140e0a] bg-[#d4af37] text-[#140e0a] px-2.5 py-1 font-[var(--font-pixel)] text-[10px] shrink-0">
                          NV. {save.level}
                        </span>
                      </div>

                      {/* Estadísticas rápidas */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border-4 border-[#140e0a] bg-[#2b2118] p-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[#d4af37]">
                            <CoinIcon className="w-4 h-4" />
                            <span className="font-[var(--font-pixel)] text-[11px]">
                              {save.gold}
                            </span>
                          </div>
                          <p className="font-[var(--font-retro)] text-lg text-[#c8b698]">Oro</p>
                        </div>

                        <div className="border-4 border-[#140e0a] bg-[#2b2118] p-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[#f4e6c8]">
                            <SkullIcon className="w-4 h-4" />
                            <span className="font-[var(--font-pixel)] text-[11px]">
                              {bossesCount}
                            </span>
                          </div>
                          <p className="font-[var(--font-retro)] text-lg text-[#c8b698]">Jefes</p>
                        </div>

                        <div className="border-4 border-[#140e0a] bg-[#2b2118] p-2 text-center">
                          <p className="font-[var(--font-pixel)] text-[11px] text-[#3ca370]">
                            {save.maxHp} HP
                          </p>
                          <p className="font-[var(--font-retro)] text-lg text-[#c8b698]">
                            {save.maxStamina} ST
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="pt-2 border-t-4 border-[#5c4033] flex flex-wrap items-center justify-between gap-2">
                      <PixelButton
                        variant="gold"
                        size="sm"
                        onClick={() => navigate(`/camp/${save.id}`)}
                      >
                        Cargar Campamento
                      </PixelButton>

                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <PixelButton
                            variant="danger"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => void handleDeleteSave(save.id)}
                          >
                            {isDeleting ? 'Borrando...' : 'Confirmar'}
                          </PixelButton>
                          <PixelButton
                            variant="primary"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            No
                          </PixelButton>
                        </div>
                      ) : (
                        <PixelButton
                          variant="danger"
                          size="sm"
                          onClick={() => setConfirmDeleteId(save.id)}
                        >
                          Borrar
                        </PixelButton>
                      )}
                    </div>
                  </PixelPanel>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
