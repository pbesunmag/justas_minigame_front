import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { buyArmoryItem, equipArmoryItem } from '../api/gameApi'
import { getArmoryCatalog, getSaveById } from '../api/savesApi'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelHorseAvatar } from '../components/ui/PixelKnightAvatar'
import { PixelPanel } from '../components/ui/PixelPanel'
import { CoinIcon } from '../components/ui/PixelSprites'
import type { ArmoryCatalogResponse, ArmoryItem, SaveGameSummary } from '../types/api'

type ArmoryTab = 'weapons' | 'armors' | 'horses'

export function ArmoryPage() {
  const { saveId } = useParams<{ saveId: string }>()
  const navigate = useNavigate()

  const [save, setSave] = useState<SaveGameSummary | null>(null)
  const [catalog, setCatalog] = useState<ArmoryCatalogResponse | null>(null)
  const [tab, setTab] = useState<ArmoryTab>('weapons')
  const [loading, setLoading] = useState(true)
  const [busyItemId, setBusyItemId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const loadData = useCallback(async () => {
    if (!saveId) return
    setLoading(true)
    try {
      const [saveData, catalogData] = await Promise.all([
        getSaveById(saveId),
        getArmoryCatalog(saveId),
      ])
      setSave(saveData)
      setCatalog(catalogData)
    } catch (err) {
      setFeedback({
        type: 'err',
        text: extractApiError(err, 'No se pudo cargar la armería real.'),
      })
    } finally {
      setLoading(false)
    }
  }, [saveId])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleBuy = async (item: ArmoryItem) => {
    if (!saveId) return
    setBusyItemId(item.id)
    setFeedback(null)
    try {
      const res = await buyArmoryItem(saveId, item.id)
      setFeedback({ type: 'ok', text: `${res.message}: ${item.name}` })
      await loadData()
    } catch (err) {
      setFeedback({
        type: 'err',
        text: extractApiError(err, 'No se pudo comprar este equipo.'),
      })
    } finally {
      setBusyItemId(null)
    }
  }

  const handleEquip = async (item: ArmoryItem) => {
    if (!saveId) return
    setBusyItemId(item.id)
    setFeedback(null)
    try {
      const res = await equipArmoryItem(saveId, item.id)
      setFeedback({ type: 'ok', text: `${res.message}: ${item.name}` })
      await loadData()
    } catch (err) {
      setFeedback({
        type: 'err',
        text: extractApiError(err, 'No se pudo equipar este objeto.'),
      })
    } finally {
      setBusyItemId(null)
    }
  }

  const items: ArmoryItem[] = catalog ? catalog[tab] : []

  return (
    <div className="min-h-screen pixel-bg-pattern p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Cabecera */}
        <PixelPanel variant="dark" bodyClassName="py-4 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase">
                Forja y Establos Reales
              </p>
              <h1 className="mt-1 font-[var(--font-pixel)] text-base sm:text-xl text-[#f4e6c8] uppercase pixel-text-shadow-sm">
                Armería de {save?.knightName ?? 'Caballero'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border-4 border-[#140e0a] bg-[#3d2e22] px-3 py-2 shadow-[3px_3px_0px_#140e0a]">
                <CoinIcon className="w-5 h-5" />
                <span className="font-[var(--font-pixel)] text-xs text-[#d4af37]">
                  {save?.gold ?? 0} ORO
                </span>
              </div>
              <PixelButton
                variant="primary"
                size="sm"
                onClick={() => navigate(`/camp/${saveId}`)}
              >
                ◀ Campamento
              </PixelButton>
            </div>
          </div>
        </PixelPanel>

        {/* Triángulo de armas */}
        <PixelPanel
          title="Triángulo Táctico de Armas"
          subtitle="Cambia entre tus armas desbloqueadas antes de entrar a la arena."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="border-4 border-[#140e0a] bg-[#2b2118] p-3">
              <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37]">LANZA</p>
              <p className="font-[var(--font-retro)] text-xl text-[#f4e6c8]">
                Escala +30% por velocidad · Ideal a galope alto
              </p>
            </div>
            <div className="border-4 border-[#140e0a] bg-[#2b2118] p-3">
              <p className="font-[var(--font-pixel)] text-[10px] text-[#b8292f]">MAZA</p>
              <p className="font-[var(--font-retro)] text-xl text-[#f4e6c8]">
                Multiplicador brutal contra escudos (1.8x - 2.0x)
              </p>
            </div>
            <div className="border-4 border-[#140e0a] bg-[#2b2118] p-3">
              <p className="font-[var(--font-pixel)] text-[10px] text-[#3b7dd8]">ESPADA</p>
              <p className="font-[var(--font-retro)] text-xl text-[#f4e6c8]">
                Bajo consumo de stamina · Golpes rápidos y seguros
              </p>
            </div>
          </div>
        </PixelPanel>

        {feedback && (
          <div
            role="status"
            className={`border-4 border-[#140e0a] px-4 py-3 shadow-[4px_4px_0px_#140e0a] ${
              feedback.type === 'ok'
                ? 'bg-[#3ca370] text-[#140e0a]'
                : 'bg-[#b8292f] text-[#f4e6c8]'
            }`}
          >
            <p className="font-[var(--font-retro)] text-2xl">{feedback.text}</p>
          </div>
        )}

        {/* Pestañas */}
        <div className="grid grid-cols-3 gap-3">
          <PixelButton
            variant={tab === 'weapons' ? 'gold' : 'primary'}
            onClick={() => setTab('weapons')}
          >
            Armas ({catalog?.weapons.length ?? 0})
          </PixelButton>
          <PixelButton
            variant={tab === 'armors' ? 'gold' : 'primary'}
            onClick={() => setTab('armors')}
          >
            Armaduras ({catalog?.armors.length ?? 0})
          </PixelButton>
          <PixelButton
            variant={tab === 'horses' ? 'gold' : 'primary'}
            onClick={() => setTab('horses')}
          >
            Establos ({catalog?.horses.length ?? 0})
          </PixelButton>
        </div>

        {/* Cabecera especial de Establos si está en la pestaña de caballos */}
        {tab === 'horses' && save && (
          <PixelPanel variant="wood">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1">
                <PixelHorseAvatar horseColor={save.horseColor} className="w-24 h-24" />
              </div>
              <div>
                <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] uppercase">
                  Tu Corcel: {save.horseName}
                </p>
                <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
                  Pelaje: {save.horseColor} · Puedes entrenar o cambiar a nuevas razas de guerra aquí.
                </p>
              </div>
            </div>
          </PixelPanel>
        )}

        {/* Catálogo de objetos */}
        {loading ? (
          <PixelPanel>
            <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] text-center py-8">
              Puliendo aceros en la forja...
            </p>
          </PixelPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const isBusy = busyItemId === item.id
              const badgeColor =
                item.status === 'EQUIPPED'
                  ? 'bg-[#3ca370] text-[#140e0a]'
                  : item.status === 'OWNED'
                    ? 'bg-[#3b7dd8] text-[#f4e6c8]'
                    : item.status === 'AVAILABLE'
                      ? 'bg-[#d4af37] text-[#140e0a]'
                      : 'bg-[#4a3c31] text-[#c8b698]'

              const statusLabel: Record<string, string> = {
                EQUIPPED: 'EQUIPADO',
                OWNED: 'EN PROPIEDAD',
                AVAILABLE: 'DISPONIBLE',
                LOCKED: 'BLOQUEADO',
              }

              return (
                <PixelPanel
                  key={item.id}
                  className="h-full"
                  bodyClassName="flex flex-col justify-between gap-4 h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b-4 border-[#5c4033] pb-2">
                      <h3 className="font-[var(--font-pixel)] text-[11px] text-[#f4e6c8] uppercase leading-snug">
                        {item.name}
                      </h3>
                      <span
                        className={`border-2 border-[#140e0a] px-2 py-0.5 font-[var(--font-pixel)] text-[8px] shrink-0 ${badgeColor}`}
                      >
                        {statusLabel[item.status] ?? item.status}
                      </span>
                    </div>

                    {/* Estadísticas */}
                    <div className="border-4 border-[#140e0a] bg-[#2b2118] p-3 space-y-1 font-[var(--font-retro)] text-xl">
                      {Object.entries(item.stats).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-[#c8b698] capitalize">{key}:</span>
                          <span className="text-[#f4e6c8]">{String(val)}</span>
                        </div>
                      ))}
                    </div>

                    {item.lockReason && (
                      <p className="font-[var(--font-retro)] text-xl text-[#df4b51]">
                        🔒 {item.lockReason}
                      </p>
                    )}
                  </div>

                  {/* Acción */}
                  <div className="pt-2 border-t-4 border-[#5c4033] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[#d4af37]">
                      <CoinIcon className="w-4 h-4" />
                      <span className="font-[var(--font-pixel)] text-[11px]">
                        {item.price === 0 ? 'GRATIS' : `${item.price}`}
                      </span>
                    </div>

                    {item.status === 'EQUIPPED' && (
                      <PixelButton variant="disabled" size="sm" disabled>
                        En Uso
                      </PixelButton>
                    )}
                    {item.status === 'OWNED' && (
                      <PixelButton
                        variant="gold"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void handleEquip(item)}
                      >
                        {isBusy ? 'Equipando...' : 'Equipar'}
                      </PixelButton>
                    )}
                    {item.status === 'AVAILABLE' && (
                      <PixelButton
                        variant="primary"
                        size="sm"
                        disabled={isBusy || (save?.gold ?? 0) < item.price}
                        onClick={() => void handleBuy(item)}
                      >
                        {isBusy ? 'Comprando...' : 'Comprar'}
                      </PixelButton>
                    )}
                    {item.status === 'LOCKED' && (
                      <PixelButton variant="disabled" size="sm" disabled>
                        Bloqueado
                      </PixelButton>
                    )}
                  </div>
                </PixelPanel>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
