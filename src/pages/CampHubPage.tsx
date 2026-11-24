import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { getArmoryCatalog, getSaveById } from '../api/savesApi'
import { PixelButton } from '../components/ui/PixelButton'
import {
  PixelHorseAvatar,
  PixelKnightAvatar,
  resolveArmorColor,
} from '../components/ui/PixelKnightAvatar'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelProgressBar } from '../components/ui/PixelProgressBar'
import {
  ArmorIcon,
  CoinIcon,
  HorseIcon,
  ShieldIcon,
  SkullIcon,
  SwordIcon,
} from '../components/ui/PixelSprites'
import { useAuth } from '../context/AuthContext'
import type { ArmoryCatalogResponse, SaveGameSummary } from '../types/api'

function formatEquipmentFallback(id: string | null): string {
  if (!id) return 'Sin equipar'
  return id
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

function buildNameLookup(catalog: ArmoryCatalogResponse | null): Record<string, string> {
  if (!catalog) return {}
  const map: Record<string, string> = {}
  for (const item of [...catalog.weapons, ...catalog.armors, ...catalog.horses]) {
    map[item.id] = item.name
  }
  return map
}

export function CampHubPage() {
  const { saveId } = useParams<{ saveId: string }>()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [save, setSave] = useState<SaveGameSummary | null>(null)
  const [itemNames, setItemNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCampData = useCallback(async () => {
    if (!saveId) return
    setLoading(true)
    setError(null)
    try {
      const saveData = await getSaveById(saveId)
      setSave(saveData)

      try {
        const catalog = await getArmoryCatalog(saveId)
        setItemNames(buildNameLookup(catalog))
      } catch {
        // Fallback a nombres formateados si falla el catálogo.
      }
    } catch (err) {
      setError(extractApiError(err, 'No se pudo cargar el campamento del caballero.'))
    } finally {
      setLoading(false)
    }
  }, [saveId])

  useEffect(() => {
    void loadCampData()
  }, [loadCampData])

  const resolveName = (id: string | null) => {
    if (!id) return 'Sin equipar'
    return itemNames[id] ?? formatEquipmentFallback(id)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen pixel-bg-pattern flex items-center justify-center p-4">
        <PixelPanel className="max-w-md w-full">
          <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] text-center py-6">
            Levantando tiendas del campamento...
          </p>
        </PixelPanel>
      </div>
    )
  }

  if (error || !save) {
    return (
      <div className="min-h-screen pixel-bg-pattern flex items-center justify-center p-4">
        <PixelPanel title="Error de Campaña" className="max-w-lg w-full">
          <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8] mb-5">
            {error ?? 'No se encontró la partida solicitada.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <PixelButton variant="gold" onClick={() => void loadCampData()}>
              Reintentar
            </PixelButton>
            <PixelButton variant="primary" onClick={() => navigate('/saves')}>
              Volver a Pergaminos
            </PixelButton>
          </div>
        </PixelPanel>
      </div>
    )
  }

  const xpNextLevel = Math.max(100, save.level * 100)
  const bossesCount = save.defeatedBosses?.length ?? 0

  return (
    <div className="min-h-screen pixel-bg-pattern p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Cabecera del Campamento */}
        <PixelPanel variant="dark" bodyClassName="py-4 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase tracking-widest">
                Campamento del Caballero
              </p>
              <h1 className="mt-1 font-[var(--font-pixel)] text-base sm:text-xl text-[#f4e6c8] uppercase pixel-text-shadow-sm">
                {save.knightName}
              </h1>
              <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">
                Jugador: {user ?? 'Escudero'} · Edad: {save.age} años · Corcel: {save.horseName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border-4 border-[#140e0a] bg-[#3d2e22] px-3 py-2 shadow-[3px_3px_0px_#140e0a]">
                <CoinIcon className="w-5 h-5" />
                <span className="font-[var(--font-pixel)] text-xs text-[#d4af37]">
                  {save.gold} ORO
                </span>
              </div>
              <PixelButton variant="danger" size="sm" onClick={handleLogout}>
                Salir
              </PixelButton>
            </div>
          </div>
        </PixelPanel>

        {/* Cuerpo principal: Retrato dinámico + Estadísticas y Equipo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-5 space-y-6">
            <PixelPanel title="Perfil de Combate">
              <div className="flex flex-col items-center text-center mb-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="border-4 border-[#140e0a] p-1 bg-[#d4af37] shadow-[4px_4px_0px_#140e0a]">
                    <PixelKnightAvatar
                      bodyType={save.bodyType}
                      skinTone={save.skinTone}
                      hairStyle={save.hairStyle}
                      hairColor={save.hairColor}
                      armorColor={resolveArmorColor(save.armorId)}
                      className="w-28 h-28 sm:w-32 sm:h-32"
                    />
                  </div>
                  <div className="border-4 border-[#140e0a] p-1 bg-[#5c4033] shadow-[4px_4px_0px_#140e0a]">
                    <PixelHorseAvatar
                      horseColor={save.horseColor}
                      className="w-24 h-24 sm:w-28 sm:h-28"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="border-4 border-[#140e0a] bg-[#d4af37] text-[#140e0a] px-3 py-1 font-[var(--font-pixel)] text-xs">
                    NIVEL {save.level}
                  </span>
                  <span className="border-4 border-[#140e0a] bg-[#2b2118] text-[#f4e6c8] px-3 py-1 font-[var(--font-pixel)] text-[10px] flex items-center gap-1.5">
                    <SkullIcon className="w-4 h-4" />
                    {bossesCount} JEFES
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <PixelProgressBar label="HP" current={save.maxHp} max={save.maxHp} tone="hp" />
                <PixelProgressBar
                  label="STAMINA"
                  current={save.maxStamina}
                  max={save.maxStamina}
                  tone="stamina"
                />
                <PixelProgressBar
                  label="XP"
                  current={save.experience}
                  max={xpNextLevel}
                  tone="xp"
                />
              </div>
            </PixelPanel>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-7 space-y-6">
            <PixelPanel
              title="Equipo Actual"
              subtitle="Armamento y montura preparados para la próxima justa."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EquipmentSlotCard
                  icon={<SwordIcon className="w-7 h-7" />}
                  slotLabel="Arma Principal"
                  value={resolveName(save.mainWeaponId)}
                />
                <EquipmentSlotCard
                  icon={<ShieldIcon className="w-7 h-7" />}
                  slotLabel="Arma Secundaria"
                  value={resolveName(save.secondaryWeaponId)}
                />
                <EquipmentSlotCard
                  icon={<ArmorIcon className="w-7 h-7" />}
                  slotLabel="Armadura"
                  value={resolveName(save.armorId)}
                />
                <EquipmentSlotCard
                  icon={<HorseIcon className="w-7 h-7" />}
                  slotLabel={`Caballo (${save.horseName})`}
                  value={resolveName(save.horseId)}
                />
              </div>

              <div className="mt-5 border-t-4 border-[#5c4033] pt-4">
                <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                  Trofeos del Torneo
                </p>
                {bossesCount === 0 ? (
                  <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">
                    Aún no has derrotado a ningún campeón. Visita la Arena de Justas para ganar gloria.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {save.defeatedBosses.map((boss) => (
                      <span
                        key={boss}
                        className="border-4 border-[#140e0a] bg-[#2b2118] px-3 py-1 font-[var(--font-retro)] text-xl text-[#d4af37]"
                      >
                        ★ {boss}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </PixelPanel>

            <PixelPanel title="Órdenes del Campamento" variant="wood">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PixelButton
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={() => navigate(`/camp/${save.id}/armory`)}
                >
                  Entrar a la Armería
                </PixelButton>

                <PixelButton
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={() => navigate(`/camp/${save.id}/arena`)}
                >
                  Ir a la Arena de Justas
                </PixelButton>

                <PixelButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/saves')}
                >
                  Cambiar de Partida
                </PixelButton>
              </div>
            </PixelPanel>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EquipmentSlotCardProps {
  icon: React.ReactNode
  slotLabel: string
  value: string
}

function EquipmentSlotCard({ icon, slotLabel, value }: EquipmentSlotCardProps) {
  return (
    <div className="border-4 border-[#140e0a] bg-[#2b2118] p-3 shadow-[3px_3px_0px_#140e0a] flex items-center gap-3">
      <div className="border-4 border-[#5c4033] bg-[#3d2e22] p-2 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-[var(--font-pixel)] text-[9px] text-[#d4af37] uppercase">
          {slotLabel}
        </p>
        <p className="mt-1 font-[var(--font-retro)] text-2xl text-[#f4e6c8] leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  )
}
