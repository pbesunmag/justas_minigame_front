import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { executeTurn, startBattle } from '../api/gameApi'
import { getSaveById } from '../api/savesApi'
import { DialogueBox } from '../components/ui/DialogueBox'
import { PixelButton } from '../components/ui/PixelButton'
import {
  CassianAvatar,
  EnemyAvatar,
  PixelKnightAvatar,
  resolveArmorColor,
} from '../components/ui/PixelKnightAvatar'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelProgressBar } from '../components/ui/PixelProgressBar'
import { CoinIcon, SkullIcon } from '../components/ui/PixelSprites'
import type {
  BattleResponse,
  HorseOrder,
  RiderAction,
  SaveGameSummary,
  TargetZone,
} from '../types/api'

const OPPONENTS: {
  code: 'KNIGHT_1' | 'KNIGHT_2' | 'ERK'
  bossKey: string
  name: string
  title: string
  style: string
  rewardHint: string
}[] = [
  {
    code: 'KNIGHT_1',
    bossKey: 'GIDEON',
    name: 'Sir Gideon el Muralla',
    title: 'Campeón Defensivo · Nivel 1',
    style: 'Armadura de placas y escudo pesado. Resiste cargas frontales.',
    rewardHint: '150 Oro · 100 XP',
  },
  {
    code: 'KNIGHT_2',
    bossKey: 'VALERIE',
    name: 'Lady Valerie la Centella',
    title: 'Duelista Ágil · Nivel 2',
    style: 'Galope veloz y esquivas constantes. Castiga ataques lentos.',
    rewardHint: '200 Oro · 150 XP',
  },
  {
    code: 'ERK',
    bossKey: 'ERK',
    name: 'Erk, Caballero de las Estepas',
    title: 'Maestro Nómada · Jefe Final',
    style: 'Sable curvo, montura incansable y tácticas impredecibles.',
    rewardHint: '350 Oro · 250 XP',
  },
]

const RIDER_ACTIONS: { id: RiderAction; label: string; tone?: 'primary' | 'gold' | 'danger' }[] = [
  { id: 'ATTACK', label: 'Atacar', tone: 'danger' },
  { id: 'DEFEND', label: 'Defender', tone: 'primary' },
  { id: 'DODGE', label: 'Esquivar', tone: 'primary' },
  { id: 'SWITCH_WEAPON', label: 'Cambiar Arma', tone: 'gold' },
  { id: 'USE_ITEM', label: 'Usar Poción', tone: 'gold' },
  { id: 'ULTIMATE', label: 'Ultimate', tone: 'gold' },
  { id: 'SURRENDER', label: 'Rendirse', tone: 'danger' },
]

const TARGET_ZONES: { id: TargetZone; label: string }[] = [
  { id: 'HEAD', label: 'Cabeza' },
  { id: 'CHEST', label: 'Pecho' },
  { id: 'SHIELD', label: 'Escudo' },
]

const HORSE_ORDERS: { id: HorseOrder; label: string }[] = [
  { id: 'ACCELERATE', label: 'Acelerar' },
  { id: 'MAINTAIN', label: 'Mantener' },
  { id: 'DECELERATE', label: 'Frenar' },
  { id: 'PET', label: 'Acariciar' },
]

export function ArenaPage() {
  const { saveId } = useParams<{ saveId: string }>()
  const navigate = useNavigate()

  const [save, setSave] = useState<SaveGameSummary | null>(null)
  const [selectedEnemy, setSelectedEnemy] = useState<'KNIGHT_1' | 'KNIGHT_2' | 'ERK'>('KNIGHT_1')
  const [battle, setBattle] = useState<BattleResponse | null>(null)
  const [historyLogs, setHistoryLogs] = useState<string[]>([])

  const [riderAction, setRiderAction] = useState<RiderAction>('ATTACK')
  const [targetZone, setTargetZone] = useState<TargetZone>('CHEST')
  const [horseOrder, setHorseOrder] = useState<HorseOrder>('MAINTAIN')
  const [selectedPotion, setSelectedPotion] = useState<'pot_health' | 'pot_stamina'>('pot_health')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSave = useCallback(async () => {
    if (!saveId) return
    setLoading(true)
    try {
      const data = await getSaveById(saveId)
      setSave(data)
    } catch (err) {
      setError(extractApiError(err, 'No se pudo cargar el perfil del caballero.'))
    } finally {
      setLoading(false)
    }
  }, [saveId])

  useEffect(() => {
    void loadSave()
  }, [loadSave])

  const handleStartBattle = async (enemyCode: 'KNIGHT_1' | 'KNIGHT_2' | 'ERK') => {
    if (!saveId) return
    setError(null)
    setSubmitting(true)
    setSelectedEnemy(enemyCode)
    try {
      const res = await startBattle(saveId, { enemyCode })
      setBattle(res)
      setHistoryLogs(res.turnNarrative ?? [])
      setRiderAction('ATTACK')
      setTargetZone('CHEST')
      setHorseOrder('MAINTAIN')
    } catch (err) {
      setError(extractApiError(err, 'No se pudo iniciar la justa en la arena.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleExecuteTurn = async () => {
    if (!saveId || !battle || battle.status === 'FINISHED') return
    setError(null)
    setSubmitting(true)
    try {
      const res = await executeTurn(saveId, battle.battleId, {
        riderAction,
        targetZone,
        horseOrder,
        itemId: riderAction === 'USE_ITEM' ? selectedPotion : null,
      })
      setBattle(res)
      setHistoryLogs((prev) => [
        ...prev,
        `--- Turno #${res.turnNumber} ---`,
        ...(res.turnNarrative ?? []),
      ])
      if (res.status === 'FINISHED') {
        void loadSave()
      }
    } catch (err) {
      setError(extractApiError(err, 'No se pudo resolver el pase de justa.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pixel-bg-pattern flex items-center justify-center p-4">
        <PixelPanel className="max-w-md w-full">
          <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] text-center py-6">
            Preparando la arena de justas...
          </p>
        </PixelPanel>
      </div>
    )
  }

  // Vista 1: Selección de rival antes de iniciar el combate
  if (!battle) {
    return (
      <div className="min-h-screen pixel-bg-pattern p-4 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <PixelPanel variant="dark" bodyClassName="py-4 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase">
                  La Liza Real
                </p>
                <h1 className="mt-1 font-[var(--font-pixel)] text-base sm:text-xl text-[#f4e6c8] uppercase pixel-text-shadow-sm">
                  Arena de Justas
                </h1>
              </div>
              <PixelButton variant="primary" size="sm" onClick={() => navigate(`/camp/${saveId}`)}>
                ◀ Volver al Campamento
              </PixelButton>
            </div>
          </PixelPanel>

          <DialogueBox
            speaker="Cassian — Tu Escudero"
            portrait={<CassianAvatar className="w-20 h-20" />}
            text={`¡El público ruge, ${save?.knightName ?? 'mi señor'}! Elige contra qué campeón del torneo quieres cruzar lanzas hoy junto a ${save?.horseName ?? 'tu corcel'}.`}
          />

          {error && (
            <div className="border-4 border-[#140e0a] bg-[#b8292f] px-4 py-3 text-[#f4e6c8]">
              <p className="font-[var(--font-retro)] text-2xl">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OPPONENTS.map((opp) => {
              const defeated = save?.defeatedBosses?.includes(opp.bossKey)
              return (
                <PixelPanel
                  key={opp.code}
                  className="h-full"
                  bodyClassName="flex flex-col justify-between gap-4 h-full"
                >
                  <div className="space-y-3 text-center">
                    <div className="mx-auto w-fit border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a]">
                      <EnemyAvatar enemyCode={opp.code} className="w-28 h-28" />
                    </div>
                    <h2 className="font-[var(--font-pixel)] text-xs text-[#f4e6c8] uppercase">
                      {opp.name}
                    </h2>
                    <p className="font-[var(--font-retro)] text-xl text-[#d4af37]">{opp.title}</p>
                    <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">{opp.style}</p>

                    <div className="border-2 border-[#5c4033] bg-[#2b2118] px-3 py-1.5 flex items-center justify-center gap-2">
                      <CoinIcon className="w-4 h-4" />
                      <span className="font-[var(--font-retro)] text-xl text-[#d4af37]">
                        {opp.rewardHint}
                      </span>
                    </div>

                    {defeated && (
                      <div className="inline-flex items-center gap-1 border-2 border-[#140e0a] bg-[#3ca370] text-[#140e0a] px-2.5 py-0.5 font-[var(--font-pixel)] text-[9px]">
                        <SkullIcon className="w-3.5 h-3.5" />
                        DERROTADO
                      </div>
                    )}
                  </div>

                  <PixelButton
                    variant="danger"
                    fullWidth
                    disabled={submitting}
                    onClick={() => void handleStartBattle(opp.code)}
                  >
                    {submitting && selectedEnemy === opp.code ? 'Entrando...' : 'Desafiar'}
                  </PixelButton>
                </PixelPanel>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Vista 2: Combate Activo
  const { player, enemy } = battle
  const isFinished = battle.status === 'FINISHED'
  const canUltimate = player.ultimateCharge >= 100

  return (
    <div className="min-h-screen pixel-bg-pattern p-3 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Barra superior de estado del combate */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-4 border-[#140e0a] bg-[#221912] px-4 py-2.5 shadow-[4px_4px_0px_#140e0a]">
          <span className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-[#d4af37] uppercase">
            ARENA DE JUSTAS · TURNO #{battle.turnNumber}
          </span>
          <span className="font-[var(--font-pixel)] text-[10px] text-[#f4e6c8] uppercase">
            {isFinished ? 'COMBATE FINALIZADO' : 'EN CURSO'}
          </span>
          <PixelButton variant="primary" size="sm" onClick={() => navigate(`/camp/${saveId}`)}>
            Campamento
          </PixelButton>
        </div>

        {/* HUD Superior: Jugador vs Rival */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Jugador */}
          <PixelPanel title={`${player.name} · Montura: ${save?.horseName ?? 'Corcel'}`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1 shrink-0 shadow-[3px_3px_0px_#140e0a]">
                <PixelKnightAvatar
                  bodyType={save?.bodyType}
                  skinTone={save?.skinTone}
                  hairStyle={save?.hairStyle}
                  hairColor={save?.hairColor}
                  armorColor={resolveArmorColor(save?.armorId)}
                  className="w-24 h-24"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <PixelProgressBar
                  label="HP"
                  current={Math.ceil(player.currentHp)}
                  max={Math.ceil(player.maxHp)}
                  tone="hp"
                />
                <PixelProgressBar
                  label={player.shieldBroken ? 'ESCUDO ROTO' : 'ESCUDO'}
                  current={Math.ceil(player.currentShieldHp)}
                  max={Math.ceil(player.maxShieldHp)}
                  tone="shield"
                />
                <PixelProgressBar
                  label="STAMINA"
                  current={player.currentStamina}
                  max={player.maxStamina}
                  tone="stamina"
                />
                <PixelProgressBar
                  label="ULTIMATE"
                  current={Math.round(player.ultimateCharge)}
                  max={100}
                  tone="xp"
                />
                <div className="flex flex-wrap justify-between gap-2 pt-1 font-[var(--font-retro)] text-xl text-[#c8b698]">
                  <span>Arma: <strong className="text-[#f4e6c8]">{player.activeWeapon}</strong></span>
                  <span>
                    Vel: <strong className="text-[#3b7dd8]">{player.currentSpeed}</strong> · Fatiga:{' '}
                    <strong className={player.horsePanicked ? 'text-[#b8292f]' : 'text-[#d4af37]'}>
                      {player.currentFatigue}{player.horsePanicked ? ' (¡PÁNICO!)' : ''}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </PixelPanel>

          {/* Enemigo */}
          <PixelPanel title={`Rival · ${enemy.name}`}>
            <div className="flex flex-col sm:flex-row-reverse gap-4 items-center sm:items-start">
              <div className="border-4 border-[#140e0a] bg-[#b8292f] p-1 shrink-0 shadow-[3px_3px_0px_#140e0a]">
                <EnemyAvatar enemyCode={selectedEnemy} className="w-24 h-24" />
              </div>
              <div className="flex-1 w-full space-y-2">
                <PixelProgressBar
                  label="HP"
                  current={Math.ceil(enemy.currentHp)}
                  max={Math.ceil(enemy.maxHp)}
                  tone="hp"
                />
                <PixelProgressBar
                  label={enemy.shieldBroken ? 'ESCUDO ROTO' : 'ESCUDO'}
                  current={Math.ceil(enemy.currentShieldHp)}
                  max={Math.ceil(enemy.maxShieldHp)}
                  tone="shield"
                />
                <PixelProgressBar
                  label="STAMINA"
                  current={enemy.currentStamina}
                  max={enemy.maxStamina}
                  tone="stamina"
                />
                <PixelProgressBar
                  label="ULTIMATE"
                  current={Math.round(enemy.ultimateCharge)}
                  max={100}
                  tone="xp"
                />
                <div className="flex flex-wrap justify-between gap-2 pt-1 font-[var(--font-retro)] text-xl text-[#c8b698]">
                  <span>Arma: <strong className="text-[#f4e6c8]">{enemy.activeWeapon}</strong></span>
                  <span>
                    Vel: <strong className="text-[#b8292f]">{enemy.currentSpeed}</strong> · Fatiga:{' '}
                    <strong className={enemy.horsePanicked ? 'text-[#3ca370]' : 'text-[#d4af37]'}>
                      {enemy.currentFatigue}{enemy.horsePanicked ? ' (¡PÁNICO!)' : ''}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>

        {/* Rincón de Cassian (en tiempo real) */}
        <DialogueBox
          speaker="Rincón de Cassian — Consejo Táctico"
          portrait={<CassianAvatar className="w-16 h-16 sm:w-20 sm:h-20" />}
          text={battle.cassianTip || '¡Firme en la silla, mi señor! Mide bien el siguiente pase.'}
          speedMs={14}
        />

        {error && (
          <div className="border-4 border-[#140e0a] bg-[#b8292f] px-4 py-3 text-[#f4e6c8]">
            <p className="font-[var(--font-retro)] text-2xl">{error}</p>
          </div>
        )}

        {/* Panel de Recompensas si el combate terminó */}
        {isFinished && (
          <PixelPanel
            title={player.currentHp > 0 ? '¡Victoria en la Arena!' : 'Derrota en la Liza'}
            variant="wood"
          >
            <div className="space-y-3">
              {battle.reward ? (
                <div className="space-y-2 font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
                  <p className="text-[#d4af37]">
                    Botín obtenido: +{battle.reward.goldEarned} Oro · +{battle.reward.xpEarned} XP
                    {battle.reward.leveledUp && ` · ¡SUBIDA A NIVEL ${battle.reward.newLevel}!`}
                  </p>
                  {battle.reward.logs?.map((line, idx) => (
                    <p key={idx} className="text-[#f4e6c8]">
                      ★ {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
                  El combate ha concluido. Regresa al campamento para revisar tu equipo o desafía de nuevo.
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <PixelButton variant="gold" onClick={() => setBattle(null)}>
                  Elegir Otro Rival
                </PixelButton>
                <PixelButton
                  variant="primary"
                  onClick={() => navigate(`/camp/${saveId}/armory`)}
                >
                  Ir a la Armería
                </PixelButton>
                <PixelButton variant="primary" onClick={() => navigate(`/camp/${saveId}`)}>
                  Volver al Campamento
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        )}

        {/* Panel de órdenes simultáneas + Registro narrativo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Órdenes */}
          <div className="lg:col-span-7">
            <PixelPanel title="Órdenes Simultáneas del Pase">
              <div className="space-y-5">
                {/* Acción de Jinete */}
                <div>
                  <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                    1. Acción de Jinete
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RIDER_ACTIONS.map((act) => {
                      const isUltBlocked = act.id === 'ULTIMATE' && !canUltimate
                      const selected = riderAction === act.id
                      return (
                        <PixelButton
                          key={act.id}
                          size="sm"
                          disabled={isFinished || isUltBlocked}
                          variant={selected ? 'gold' : act.tone ?? 'primary'}
                          onClick={() => setRiderAction(act.id)}
                        >
                          {act.label}
                        </PixelButton>
                      )
                    })}
                  </div>
                </div>

                {/* Selector de zona si ataca o ultimate */}
                {(riderAction === 'ATTACK' || riderAction === 'ULTIMATE') && (
                  <div>
                    <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                      Zona Objetivo
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {TARGET_ZONES.map((z) => (
                        <PixelButton
                          key={z.id}
                          size="sm"
                          disabled={isFinished}
                          variant={targetZone === z.id ? 'danger' : 'primary'}
                          onClick={() => setTargetZone(z.id)}
                        >
                          {z.label}
                        </PixelButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de poción si usa objeto */}
                {riderAction === 'USE_ITEM' && (
                  <div>
                    <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                      Elegir Consumible
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <PixelButton
                        size="sm"
                        disabled={isFinished}
                        variant={selectedPotion === 'pot_health' ? 'gold' : 'primary'}
                        onClick={() => setSelectedPotion('pot_health')}
                      >
                        Poción de Salud
                      </PixelButton>
                      <PixelButton
                        size="sm"
                        disabled={isFinished}
                        variant={selectedPotion === 'pot_stamina' ? 'gold' : 'primary'}
                        onClick={() => setSelectedPotion('pot_stamina')}
                      >
                        Elixir de Vigor
                      </PixelButton>
                    </div>
                  </div>
                )}

                {/* Orden al Caballo */}
                <div>
                  <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                    2. Orden a {save?.horseName ?? 'tu Caballo'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HORSE_ORDERS.map((ord) => (
                      <PixelButton
                        key={ord.id}
                        size="sm"
                        disabled={isFinished}
                        variant={horseOrder === ord.id ? 'gold' : 'primary'}
                        onClick={() => setHorseOrder(ord.id)}
                      >
                        {ord.label}
                      </PixelButton>
                    ))}
                  </div>
                </div>

                {/* Ejecutar Turno */}
                <PixelButton
                  variant="danger"
                  size="lg"
                  fullWidth
                  disabled={isFinished || submitting}
                  onClick={() => void handleExecuteTurn()}
                >
                  {submitting ? 'Resolviendo Choque...' : '⚔ Ejecutar Pase de Justa'}
                </PixelButton>
              </div>
            </PixelPanel>
          </div>

          {/* Registro Narrativo */}
          <div className="lg:col-span-5">
            <PixelPanel title="Crónica del Combate" className="h-full">
              <div className="h-80 overflow-y-auto border-4 border-[#140e0a] bg-[#1e1610] p-3 space-y-2">
                {historyLogs.length === 0 ? (
                  <p className="font-[var(--font-retro)] text-xl text-[#8c7860]">
                    Esperando el primer cruce de lanzas...
                  </p>
                ) : (
                  historyLogs.map((entry, idx) => (
                    <p
                      key={idx}
                      className={`font-[var(--font-retro)] text-xl leading-snug ${
                        entry.startsWith('---')
                          ? 'text-[#d4af37] border-t border-[#5c4033] pt-2'
                          : 'text-[#f4e6c8]'
                      }`}
                    >
                      {entry}
                    </p>
                  ))
                )}
              </div>
            </PixelPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
