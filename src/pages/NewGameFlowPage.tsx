import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractApiError } from '../api/errorUtils'
import { createSave } from '../api/savesApi'
import { DialogueBox } from '../components/ui/DialogueBox'
import { PixelButton } from '../components/ui/PixelButton'
import {
  CassianAvatar,
  PixelHorseAvatar,
  PixelKnightAvatar,
  resolveArmorColor,
} from '../components/ui/PixelKnightAvatar'
import { PixelPanel } from '../components/ui/PixelPanel'
import { PixelProgressBar } from '../components/ui/PixelProgressBar'
import { TournamentCrestSprite } from '../components/ui/PixelSprites'
import type {
  BodyType,
  HairColor,
  HairStyle,
  HorseColor,
  SkinTone,
} from '../types/api'

const BODY_TYPES: { id: BodyType; label: string }[] = [
  { id: 'SLIM', label: 'Delgado' },
  { id: 'ATHLETIC', label: 'Atlético' },
  { id: 'ROBUST', label: 'Robusto' },
]

const SKIN_TONES: { id: SkinTone; label: string; swatch: string }[] = [
  { id: 'FAIR', label: 'Clara', swatch: '#f7d7be' },
  { id: 'LIGHT', label: 'Trigueña', swatch: '#eac09d' },
  { id: 'OLIVE', label: 'Oliva', swatch: '#d1a074' },
  { id: 'TAN', label: 'Bronce', swatch: '#b0784d' },
  { id: 'DEEP', label: 'Oscura', swatch: '#75472a' },
]

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'SHORT', label: 'Corto' },
  { id: 'LONG', label: 'Melena' },
  { id: 'SHAVED', label: 'Rapado' },
  { id: 'BRAID', label: 'Trenza' },
]

const HAIR_COLORS: { id: HairColor; label: string; swatch: string }[] = [
  { id: 'BLACK', label: 'Azabache', swatch: '#1e1b18' },
  { id: 'BROWN', label: 'Castaño', swatch: '#5c3821' },
  { id: 'BLONDE', label: 'Rubio', swatch: '#d9b34a' },
  { id: 'RED', label: 'Pelirrojo', swatch: '#a83622' },
  { id: 'WHITE', label: 'Blanco', swatch: '#d8dde6' },
]

const STARTER_ARMORS = [
  {
    id: 'arm_chain',
    name: 'Cota de Malla Reforzada',
    affinity: 'Media · Equilibrada',
    headDef: 15,
    chestDef: 25,
    weight: 12,
    desc: 'Protección sólida para justas clásicas sin sacrificar demasiada agilidad.',
  },
  {
    id: 'arm_steppe',
    name: 'Cuero Endurecido y Pieles',
    affinity: 'Ligera · Ágil',
    headDef: 10,
    chestDef: 18,
    weight: 6,
    desc: 'Ideal para esquivar cargas enemigas y mantener la stamina alta.',
  },
  {
    id: 'arm_plate',
    name: 'Placas Completas de Torneo',
    affinity: 'Pesada · Fortaleza',
    headDef: 25,
    chestDef: 40,
    weight: 22,
    desc: 'Máxima absorción de impacto contra lanzas y mazas, aunque pesa más.',
  },
]

const STARTER_HORSES = [
  {
    id: 'hrs_tourney',
    name: 'Corcel de Torneo Imperial',
    temperament: 'Sereno',
    maxSpeed: 4,
    maxFatigue: 8,
    desc: 'Equilibrado, dócil y fiable para cualquier estilo de justa.',
  },
  {
    id: 'hrs_destrier',
    name: 'Titán Percherón',
    temperament: 'Firme',
    maxSpeed: 3,
    maxFatigue: 10,
    desc: 'Aguanta el galope prolongado sin entrar en pánico fácilmente.',
  },
  {
    id: 'hrs_pure',
    name: 'Centella Ágil',
    temperament: 'Impetuoso',
    maxSpeed: 5,
    maxFatigue: 7,
    desc: 'Velocidad punta descomunal para cargas mortales con lanza.',
  },
  {
    id: 'hrs_steppe',
    name: 'Viento del Desierto',
    temperament: 'Tenaz',
    maxSpeed: 4,
    maxFatigue: 9,
    desc: 'Gran resistencia y trote veloz entrenado en las estepas.',
  },
]

const HORSE_COLORS: { id: HorseColor; label: string; swatch: string }[] = [
  { id: 'BAY', label: 'Castano', swatch: '#8c4b2d' },
  { id: 'BLACK', label: 'Negro', swatch: '#2c2927' },
  { id: 'WHITE', label: 'Blanco', swatch: '#e8e4da' },
  { id: 'CHESTNUT', label: 'Alazán', swatch: '#a8562a' },
  { id: 'GRAY', label: 'Tordo', swatch: '#8a9199' },
]

export function NewGameFlowPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [knightName, setKnightName] = useState('')
  const [age, setAge] = useState(22)
  const [bodyType, setBodyType] = useState<BodyType>('ATHLETIC')
  const [skinTone, setSkinTone] = useState<SkinTone>('LIGHT')
  const [hairStyle, setHairStyle] = useState<HairStyle>('SHORT')
  const [hairColor, setHairColor] = useState<HairColor>('BROWN')
  const [initialArmorId, setInitialArmorId] = useState('arm_chain')
  const [initialHorseId, setInitialHorseId] = useState('hrs_tourney')
  const [horseColor, setHorseColor] = useState<HorseColor>('BAY')
  const [horseName, setHorseName] = useState('Relámpago')

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleConfirmStables = () => {
    setError(null)
    if (!horseName.trim()) {
      setError('Tu corcel merece un nombre digno antes de entrar en la liza.')
      return
    }
    setStep(5)
  }

  const handleFinalizeCampaign = async () => {
    setError(null)
    setSaving(true)
    try {
      const created = await createSave({
        knightName: knightName.trim() || 'Sir Sin Nombre',
        age,
        bodyType,
        skinTone,
        hairStyle,
        hairColor,
        horseName: horseName.trim() || 'Relámpago',
        horseColor,
        initialArmorId,
        initialHorseId,
      })
      navigate(`/camp/${created.id}`, { replace: true })
    } catch (err) {
      setError(extractApiError(err, 'No se pudo inscribir al caballero en el torneo.'))
      setSaving(false)
    }
  }

  const stepLabels = [
    '1. Prólogo',
    '2. Inscripción',
    '3. Armería',
    '4. Establos',
  ]

  return (
    <div className="min-h-screen pixel-bg-pattern p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Cabecera de progreso */}
        <PixelPanel variant="dark" bodyClassName="py-4 px-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <TournamentCrestSprite className="w-10 h-10 shrink-0" />
              <div>
                <h1 className="font-[var(--font-pixel)] text-xs sm:text-base text-[#d4af37] uppercase pixel-text-shadow-sm">
                  Forja de Leyenda — Nueva Partida
                </h1>
                <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">
                  Año del Señor de 1384 · Villa Real de Valdecruz
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {stepLabels.map((label, idx) => {
                const currentStepNum = idx + 1
                const active = step === currentStepNum || (step === 5 && currentStepNum === 4)
                const done = step > currentStepNum
                return (
                  <span
                    key={label}
                    className={`border-2 border-[#140e0a] px-2.5 py-1 font-[var(--font-pixel)] text-[9px] uppercase ${
                      active
                        ? 'bg-[#d4af37] text-[#140e0a]'
                        : done
                          ? 'bg-[#3ca370] text-[#140e0a]'
                          : 'bg-[#2b2118] text-[#8c7860]'
                    }`}
                  >
                    {label}
                  </span>
                )
              })}
              <PixelButton variant="danger" size="sm" onClick={() => navigate('/saves')}>
                Cancelar
              </PixelButton>
            </div>
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

        {/* PASO 1: LLEGADA AL PUEBLO (PRÓLOGO) */}
        {step === 1 && (
          <div className="space-y-6">
            <PixelPanel title="Prólogo — Las Puertas de Valdecruz">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="border-4 border-[#140e0a] bg-[#221912] p-4 shadow-[4px_4px_0px_#140e0a]">
                    <TournamentCrestSprite className="w-32 h-32" />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-3 font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
                  <p>
                    Los estandartes ondean al viento sobre las murallas de piedra. Caballeros de
                    todas las comarcas acuden al <span className="text-[#d4af37]">Gran Torneo del Reino</span>{' '}
                    en busca de oro, gloria y el favor de la corona.
                  </p>
                  <p className="text-[#c8b698]">
                    El olor a acero recién templado, cuero y heno llena las calles empedradas. Al
                    cruzar el arco principal, un anciano de sonrisa franca y barba nívea se acerca
                    agitando un pergamino.
                  </p>
                </div>
              </div>
            </PixelPanel>

            <DialogueBox
              speaker="Cassian — Viejo Escudero"
              portrait={<CassianAvatar className="w-20 h-20" />}
              text="¡Por todos los santos, sangre joven en la villa! Soy Cassian. Si has venido a medir tu lanza contra los campeones del reino, primero debes inscribirte en el registro, recoger tu acero en la armería y elegir un buen corcel en los establos. ¡Vamos, sígueme!"
              actionLabel="Ir a la Mesa de Inscripción ▶"
              onAction={() => setStep(2)}
            />
          </div>
        )}

        {/* PASO 2: INSCRIPCIÓN DEL TORNEO */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vista previa en vivo */}
              <div className="lg:col-span-5">
                <PixelPanel title="Retrato Heráldico" className="h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a]">
                      <PixelKnightAvatar
                        bodyType={bodyType}
                        skinTone={skinTone}
                        hairStyle={hairStyle}
                        hairColor={hairColor}
                        armorColor={resolveArmorColor(initialArmorId)}
                        className="w-44 h-44"
                      />
                    </div>

                    <div>
                      <p className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#f4e6c8] uppercase pixel-text-shadow-sm">
                        {knightName.trim() || 'Tu Caballero'}
                      </p>
                      <p className="font-[var(--font-retro)] text-xl text-[#d4af37]">
                        Edad: {age} años · {BODY_TYPES.find((b) => b.id === bodyType)?.label}
                      </p>
                    </div>
                  </div>
                </PixelPanel>
              </div>

              {/* Formulario en pergamino */}
              <div className="lg:col-span-7">
                <PixelPanel title="Pergamino de Inscripción">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="newKnightName"
                          className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2"
                        >
                          Nombre del Caballero
                        </label>
                        <input
                          id="newKnightName"
                          type="text"
                          className="pixel-input"
                          placeholder="Ej. Sir Alaric de Valdecruz"
                          value={knightName}
                          onChange={(e) => setKnightName(e.target.value)}
                          maxLength={36}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="knightAge"
                          className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2"
                        >
                          Edad (16-70)
                        </label>
                        <input
                          id="knightAge"
                          type="number"
                          min={16}
                          max={70}
                          className="pixel-input"
                          value={age}
                          onChange={(e) =>
                            setAge(Math.max(16, Math.min(70, Number(e.target.value) || 22)))
                          }
                        />
                      </div>
                    </div>

                    {/* Fisonomía */}
                    <div>
                      <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                        Fisonomía
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {BODY_TYPES.map((b) => (
                          <PixelButton
                            key={b.id}
                            size="sm"
                            variant={bodyType === b.id ? 'gold' : 'primary'}
                            onClick={() => setBodyType(b.id)}
                          >
                            {b.label}
                          </PixelButton>
                        ))}
                      </div>
                    </div>

                    {/* Tono de piel */}
                    <div>
                      <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                        Tono de Piel
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_TONES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSkinTone(t.id)}
                            className={`border-4 px-3 py-1.5 flex items-center gap-2 font-[var(--font-retro)] text-xl cursor-pointer ${
                              skinTone === t.id
                                ? 'border-[#d4af37] bg-[#221912] text-[#f4e6c8]'
                                : 'border-[#140e0a] bg-[#2b2118] text-[#c8b698]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 border-2 border-[#140e0a] inline-block"
                              style={{ backgroundColor: t.swatch }}
                            />
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Peinado */}
                    <div>
                      <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                        Peinado
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {HAIR_STYLES.map((h) => (
                          <PixelButton
                            key={h.id}
                            size="sm"
                            variant={hairStyle === h.id ? 'gold' : 'primary'}
                            onClick={() => setHairStyle(h.id)}
                          >
                            {h.label}
                          </PixelButton>
                        ))}
                      </div>
                    </div>

                    {/* Color de pelo */}
                    <div>
                      <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                        Color de Pelo
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {HAIR_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setHairColor(c.id)}
                            className={`border-4 px-3 py-1.5 flex items-center gap-2 font-[var(--font-retro)] text-xl cursor-pointer ${
                              hairColor === c.id
                                ? 'border-[#d4af37] bg-[#221912] text-[#f4e6c8]'
                                : 'border-[#140e0a] bg-[#2b2118] text-[#c8b698]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 border-2 border-[#140e0a] inline-block"
                              style={{ backgroundColor: c.swatch }}
                            />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PixelPanel>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <PixelButton variant="primary" onClick={() => setStep(1)}>
                ◀ Volver al Prólogo
              </PixelButton>
              <PixelButton
                variant="gold"
                onClick={() => {
                  if (!knightName.trim()) {
                    setError('Escribe tu nombre en el pergamino de inscripción.')
                    return
                  }
                  setError(null)
                  setStep(3)
                }}
              >
                Firmar y Pasar a la Armería ▶
              </PixelButton>
            </div>
          </div>
        )}

        {/* PASO 3: LA ARMERÍA INICIAL */}
        {step === 3 && (
          <div className="space-y-6">
            <DialogueBox
              speaker="Cassian — Viejo Escudero"
              portrait={<CassianAvatar className="w-20 h-20" />}
              text="¡Buena planta tienes! El maestre me dejó estas tres armas básicas para ti: Espada, Lanza y Maza. Domina su triángulo táctico y elige ahora la armadura con la que entrarás a la arena."
            />

            {/* Triángulo de armas básicas */}
            <PixelPanel
              title="Arsenal Básico Desbloqueado (Triángulo de Armas)"
              subtitle="Las 3 armas básicas se añadirán automáticamente a tu armería."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-4 border-[#140e0a] bg-[#2b2118] p-4 shadow-[3px_3px_0px_#140e0a]">
                  <p className="font-[var(--font-pixel)] text-xs text-[#d4af37] uppercase">
                    Lanza Básica
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#3ca370] mt-1">
                    Ventaja: Alta velocidad (+30%/vel)
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#c8b698] mt-1">
                    Devastadora a galope tendido; ideal para embestidas directas contra jinetes ligeros.
                  </p>
                </div>

                <div className="border-4 border-[#140e0a] bg-[#2b2118] p-4 shadow-[3px_3px_0px_#140e0a]">
                  <p className="font-[var(--font-pixel)] text-xs text-[#b8292f] uppercase">
                    Maza Básica
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#3ca370] mt-1">
                    Ventaja: Rompe-escudos (1.8x)
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#c8b698] mt-1">
                    Aplasta escudos pesados y vence a rivales defensivos que abusan de la guardia.
                  </p>
                </div>

                <div className="border-4 border-[#140e0a] bg-[#2b2118] p-4 shadow-[3px_3px_0px_#140e0a]">
                  <p className="font-[var(--font-pixel)] text-xs text-[#3b7dd8] uppercase">
                    Espada Básica
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#3ca370] mt-1">
                    Ventaja: Bajo coste de stamina (9)
                  </p>
                  <p className="font-[var(--font-retro)] text-xl text-[#c8b698] mt-1">
                    Ágil, constante y fiable cuando el combate se alarga o el rival pierde su escudo.
                  </p>
                </div>
              </div>
            </PixelPanel>

            {/* Selector de Armadura Inicial */}
            <PixelPanel title="Elige tu Armadura Inicial">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STARTER_ARMORS.map((armor) => {
                  const selected = initialArmorId === armor.id
                  return (
                    <button
                      key={armor.id}
                      type="button"
                      onClick={() => setInitialArmorId(armor.id)}
                      className={`text-left border-4 p-4 transition-transform cursor-pointer ${
                        selected
                          ? 'border-[#d4af37] bg-[#221912] shadow-[4px_4px_0px_#140e0a]'
                          : 'border-[#140e0a] bg-[#2b2118] hover:bg-[#33271d]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-[var(--font-pixel)] text-[10px] text-[#f4e6c8] uppercase">
                          {armor.name}
                        </span>
                        {selected && (
                          <span className="bg-[#d4af37] text-[#140e0a] px-2 py-0.5 font-[var(--font-pixel)] text-[8px]">
                            ELEGIDA
                          </span>
                        )}
                      </div>
                      <p className="font-[var(--font-retro)] text-lg text-[#d4af37] mb-2">
                        {armor.affinity}
                      </p>
                      <p className="font-[var(--font-retro)] text-xl text-[#c8b698] mb-3">
                        {armor.desc}
                      </p>
                      <div className="border-t-2 border-[#5c4033] pt-2 font-[var(--font-retro)] text-lg text-[#f4e6c8] flex justify-between">
                        <span>Cabeza: {armor.headDef}</span>
                        <span>Pecho: {armor.chestDef}</span>
                        <span>Peso: {armor.weight}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </PixelPanel>

            <div className="flex justify-between gap-4">
              <PixelButton variant="primary" onClick={() => setStep(2)}>
                ◀ Volver a Inscripción
              </PixelButton>
              <PixelButton variant="gold" onClick={() => setStep(4)}>
                Ir a los Establos ▶
              </PixelButton>
            </div>
          </div>
        )}

        {/* PASO 4: LOS ESTABLOS */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vista previa del caballo */}
              <div className="lg:col-span-5">
                <PixelPanel title="Tu Corcel de Justa" className="h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a]">
                      <PixelHorseAvatar horseColor={horseColor} className="w-40 h-40" />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="horseNameInput"
                        className="block font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2 text-left"
                      >
                        Nombre de tu Caballo
                      </label>
                      <input
                        id="horseNameInput"
                        type="text"
                        className="pixel-input"
                        placeholder="Ej. Relámpago, Sombra..."
                        value={horseName}
                        onChange={(e) => setHorseName(e.target.value)}
                        maxLength={28}
                      />
                    </div>

                    <div className="w-full text-left">
                      <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase mb-2">
                        Color de Pelaje
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {HORSE_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setHorseColor(c.id)}
                            className={`border-4 px-2.5 py-1 flex items-center gap-2 font-[var(--font-retro)] text-xl cursor-pointer ${
                              horseColor === c.id
                                ? 'border-[#d4af37] bg-[#221912] text-[#f4e6c8]'
                                : 'border-[#140e0a] bg-[#2b2118] text-[#c8b698]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 border-2 border-[#140e0a] inline-block"
                              style={{ backgroundColor: c.swatch }}
                            />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PixelPanel>
              </div>

              {/* Selector de Raza */}
              <div className="lg:col-span-7">
                <PixelPanel title="Elige la Raza en los Establos">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STARTER_HORSES.map((horse) => {
                      const selected = initialHorseId === horse.id
                      return (
                        <button
                          key={horse.id}
                          type="button"
                          onClick={() => setInitialHorseId(horse.id)}
                          className={`text-left border-4 p-4 cursor-pointer space-y-2 ${
                            selected
                              ? 'border-[#d4af37] bg-[#221912] shadow-[4px_4px_0px_#140e0a]'
                              : 'border-[#140e0a] bg-[#2b2118] hover:bg-[#33271d]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-[var(--font-pixel)] text-[10px] text-[#f4e6c8] uppercase">
                              {horse.name}
                            </span>
                            {selected && (
                              <span className="bg-[#d4af37] text-[#140e0a] px-1.5 py-0.5 font-[var(--font-pixel)] text-[8px]">
                                OK
                              </span>
                            )}
                          </div>
                          <p className="font-[var(--font-retro)] text-lg text-[#d4af37]">
                            Carácter: {horse.temperament}
                          </p>
                          <p className="font-[var(--font-retro)] text-xl text-[#c8b698]">
                            {horse.desc}
                          </p>

                          <div className="space-y-2 pt-1">
                            <PixelProgressBar
                              label="VEL"
                              current={horse.maxSpeed}
                              max={5}
                              tone="shield"
                              className="h-6"
                            />
                            <PixelProgressBar
                              label="RES"
                              current={horse.maxFatigue}
                              max={10}
                              tone="stamina"
                              className="h-6"
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </PixelPanel>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <PixelButton variant="primary" onClick={() => setStep(3)}>
                ◀ Volver a Armería
              </PixelButton>
              <PixelButton variant="gold" size="lg" onClick={handleConfirmStables}>
                Confirmar Montura y Jurar Honor ▶
              </PixelButton>
            </div>
          </div>
        )}

        {/* PASO 5: TROMPETAS DEL TORNEO Y CASSIAN SE OFRECE COMO ESCUDERO */}
        {step === 5 && (
          <div className="space-y-6">
            <PixelPanel title="¡Suenan las Trompetas del Torneo!">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a]">
                  <PixelKnightAvatar
                    bodyType={bodyType}
                    skinTone={skinTone}
                    hairStyle={hairStyle}
                    hairColor={hairColor}
                    armorColor={resolveArmorColor(initialArmorId)}
                    className="w-36 h-36"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#d4af37] uppercase pixel-text-shadow-sm">
                    {knightName} y {horseName}
                  </p>
                  <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8]">
                    ¡Las trompetas resuenan por toda Valdecruz! La arena abre sus puertas.
                  </p>
                </div>
                <div className="border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a]">
                  <PixelHorseAvatar horseColor={horseColor} className="w-36 h-36" />
                </div>
              </div>
            </PixelPanel>

            <DialogueBox
              speaker="Cassian — Tu Escudero"
              portrait={<CassianAvatar className="w-20 h-20" />}
              text={`¡Escucha esas trompetas, ${knightName}! Tú y ${horseName} hacéis una pareja temible. Llevo décadas viendo caer a reyes y barones en esta liza... ¡Permíteme ser tu escudero! Te avisaré desde la barrera en cada pase de justa. ¿Listo para entrar al campamento?`}
              actionLabel={saving ? 'Inscribiendo en el Reino...' : '¡Aceptar y Entrar al Campamento!'}
              actionDisabled={saving}
              onAction={() => void handleFinalizeCampaign()}
            />
          </div>
        )}
      </div>
    </div>
  )
}
