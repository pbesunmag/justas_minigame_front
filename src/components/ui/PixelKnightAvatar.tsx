export interface PixelKnightAvatarProps {
  bodyType?: string
  skinTone?: string
  hairStyle?: string
  hairColor?: string
  armorColor?: string
  className?: string
}

const SKIN_PALETTE: Record<string, { base: string; shade: string }> = {
  FAIR: { base: '#f7d7be', shade: '#deb495' },
  LIGHT: { base: '#eac09d', shade: '#c99a74' },
  OLIVE: { base: '#d1a074', shade: '#af7d52' },
  TAN: { base: '#b0784d', shade: '#8a5934' },
  DEEP: { base: '#75472a', shade: '#54301a' },
}

const HAIR_PALETTE: Record<string, { base: string; highlight: string }> = {
  BLACK: { base: '#1e1b18', highlight: '#3b3530' },
  BROWN: { base: '#5c3821', highlight: '#7a4d30' },
  BLONDE: { base: '#d9b34a', highlight: '#f2cf68' },
  RED: { base: '#a83622', highlight: '#cf4b34' },
  WHITE: { base: '#d8dde6', highlight: '#f5f7fa' },
}

const HORSE_PALETTE: Record<string, { body: string; shade: string; mane: string }> = {
  BAY: { body: '#8c4b2d', shade: '#63321b', mane: '#1f1712' },
  BLACK: { body: '#2c2927', shade: '#191716', mane: '#12100f' },
  WHITE: { body: '#e8e4da', shade: '#c2bcb0', mane: '#f7f5f0' },
  CHESTNUT: { body: '#a8562a', shade: '#7d3c19', mane: '#c4713b' },
  GRAY: { body: '#8a9199', shade: '#616870', mane: '#43484f' },
}

export function resolveArmorColor(armorId?: string | null): string {
  if (!armorId) return '#7b8798'
  const id = armorId.toLowerCase()
  if (id.includes('plate')) return '#b4c0d0'
  if (id.includes('steppe') || id.includes('leather')) return '#8f5a38'
  if (id.includes('chain')) return '#7b8798'
  return '#7b8798'
}

/** Avatar dinámico pixel art del caballero compuesto por capas */
export function PixelKnightAvatar({
  bodyType = 'ATHLETIC',
  skinTone = 'LIGHT',
  hairStyle = 'SHORT',
  hairColor = 'BROWN',
  armorColor = '#7b8798',
  className = 'w-32 h-32',
}: PixelKnightAvatarProps) {
  const skin = SKIN_PALETTE[skinTone.toUpperCase()] ?? SKIN_PALETTE.LIGHT
  const hair = HAIR_PALETTE[hairColor.toUpperCase()] ?? HAIR_PALETTE.BROWN
  const body = bodyType.toUpperCase()
  const style = hairStyle.toUpperCase()

  // Ancho de hombros y torso según fisonomía
  const torsoX = body === 'SLIM' ? 7 : body === 'ROBUST' ? 4 : 5
  const torsoW = body === 'SLIM' ? 10 : body === 'ROBUST' ? 16 : 14
  const shoulderX = body === 'SLIM' ? 6 : body === 'ROBUST' ? 3 : 4
  const shoulderW = body === 'SLIM' ? 12 : body === 'ROBUST' ? 18 : 16

  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Avatar pixel art del caballero"
    >
      {/* Fondo estandarte */}
      <rect x="0" y="0" width="24" height="24" fill="#2b2118" />
      <rect x="1" y="1" width="22" height="22" fill="#3d2e22" />
      <rect x="2" y="2" width="20" height="20" fill="#221912" />

      {/* Capa trasera de melena larga o trenza */}
      {style === 'LONG' && (
        <>
          <rect x="7" y="6" width="10" height="10" fill={hair.base} />
          <rect x="6" y="8" width="2" height="8" fill={hair.base} />
          <rect x="16" y="8" width="2" height="8" fill={hair.base} />
        </>
      )}
      {style === 'BRAID' && (
        <>
          <rect x="15" y="9" width="2" height="8" fill={hair.base} />
          <rect x="16" y="10" width="1" height="2" fill={hair.highlight} />
          <rect x="16" y="14" width="1" height="2" fill={hair.highlight} />
          <rect x="15" y="16" width="2" height="1" fill="#d4af37" />
        </>
      )}

      {/* Cuello */}
      <rect x="10" y="13" width="4" height="2" fill={skin.shade} />

      {/* Cabeza */}
      <rect x="8" y="5" width="8" height="8" fill="#140e0a" />
      <rect x="9" y="6" width="6" height="7" fill={skin.base} />
      <rect x="14" y="6" width="1" height="7" fill={skin.shade} />
      <rect x="9" y="12" width="6" height="1" fill={skin.shade} />

      {/* Ojos y boca */}
      <rect x="10" y="9" width="1" height="1" fill="#140e0a" />
      <rect x="13" y="9" width="1" height="1" fill="#140e0a" />
      <rect x="11" y="11" width="2" height="1" fill="#6b3e2e" />

      {/* Capa de peinado */}
      {style === 'SHORT' && (
        <>
          <rect x="8" y="4" width="8" height="3" fill={hair.base} />
          <rect x="8" y="6" width="1" height="3" fill={hair.base} />
          <rect x="15" y="6" width="1" height="3" fill={hair.base} />
          <rect x="9" y="5" width="4" height="1" fill={hair.highlight} />
        </>
      )}
      {style === 'LONG' && (
        <>
          <rect x="7" y="4" width="10" height="3" fill={hair.base} />
          <rect x="8" y="6" width="1" height="5" fill={hair.base} />
          <rect x="15" y="6" width="1" height="5" fill={hair.base} />
          <rect x="9" y="5" width="5" height="1" fill={hair.highlight} />
        </>
      )}
      {style === 'BRAID' && (
        <>
          <rect x="8" y="4" width="8" height="3" fill={hair.base} />
          <rect x="9" y="5" width="4" height="1" fill={hair.highlight} />
        </>
      )}
      {style === 'SHAVED' && (
        <rect x="9" y="5" width="6" height="1" fill={hair.base} opacity="0.45" />
      )}

      {/* Armadura / Hombreras */}
      <rect x={shoulderX} y="15" width={shoulderW} height="3" fill="#140e0a" />
      <rect x={shoulderX + 1} y="15" width={shoulderW - 2} height="2" fill={armorColor} />

      {/* Torso / Coraza */}
      <rect x={torsoX} y="15" width={torsoW} height="7" fill="#140e0a" />
      <rect x={torsoX + 1} y="16" width={torsoW - 2} height="6" fill={armorColor} />

      {/* Tabardo carmesí con cruz dorada */}
      <rect x="9" y="16" width="6" height="6" fill="#b8292f" />
      <rect x="11" y="16" width="2" height="6" fill="#d4af37" />
      <rect x="9" y="18" width="6" height="2" fill="#d4af37" />

      {/* Cinturón */}
      <rect x={torsoX + 1} y="20" width={torsoW - 2} height="1" fill="#5c4033" />
      <rect x="11" y="20" width="2" height="1" fill="#d4af37" />
    </svg>
  )
}

/** Retrato pixel art fijo de Cassian, el viejo y alegre escudero */
export function CassianAvatar({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Retrato pixel art de Cassian"
    >
      <rect x="0" y="0" width="24" height="24" fill="#2b2118" />
      <rect x="1" y="1" width="22" height="22" fill="#3d2e22" />
      <rect x="2" y="2" width="20" height="20" fill="#241a12" />

      {/* Boina medieval de escudero */}
      <rect x="6" y="3" width="12" height="3" fill="#3ca370" />
      <rect x="7" y="2" width="9" height="2" fill="#2d7d54" />
      <rect x="16" y="3" width="2" height="2" fill="#d4af37" />

      {/* Cara amable */}
      <rect x="8" y="6" width="8" height="8" fill="#eac09d" />
      <rect x="8" y="7" width="1" height="2" fill="#e5e7eb" />
      <rect x="15" y="7" width="1" height="2" fill="#e5e7eb" />

      {/* Cejas blancas y ojos alegres */}
      <rect x="9" y="7" width="2" height="1" fill="#f3f4f6" />
      <rect x="13" y="7" width="2" height="1" fill="#f3f4f6" />
      <rect x="10" y="8" width="1" height="1" fill="#140e0a" />
      <rect x="13" y="8" width="1" height="1" fill="#140e0a" />

      {/* Mejillas sonrosadas */}
      <rect x="9" y="9" width="1" height="1" fill="#d98a7c" />
      <rect x="14" y="9" width="1" height="1" fill="#d98a7c" />

      {/* Barba blanca frondosa y sonrisa */}
      <rect x="8" y="10" width="8" height="4" fill="#f3f4f6" />
      <rect x="9" y="14" width="6" height="2" fill="#e5e7eb" />
      <rect x="10" y="15" width="4" height="1" fill="#d1d5db" />
      <rect x="10" y="11" width="4" height="1" fill="#b8292f" />

      {/* Jubón medieval verde y marrón */}
      <rect x="5" y="16" width="14" height="6" fill="#5c4033" />
      <rect x="7" y="16" width="10" height="6" fill="#3ca370" />
      <rect x="11" y="16" width="2" height="6" fill="#d4af37" />
      <rect x="6" y="19" width="12" height="1" fill="#2b2118" />
    </svg>
  )
}

/** Vista previa pixel art del caballo según color de pelaje */
export function PixelHorseAvatar({
  horseColor = 'BAY',
  className = 'w-28 h-28',
}: {
  horseColor?: string
  className?: string
}) {
  const palette = HORSE_PALETTE[horseColor.toUpperCase()] ?? HORSE_PALETTE.BAY

  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Vista previa pixel art del caballo"
    >
      <rect x="0" y="0" width="24" height="24" fill="#2b2118" />
      <rect x="1" y="1" width="22" height="22" fill="#3d2e22" />
      <rect x="2" y="2" width="20" height="20" fill="#221912" />

      {/* Cola */}
      <rect x="3" y="12" width="2" height="5" fill={palette.mane} />
      <rect x="2" y="14" width="1" height="3" fill={palette.mane} />

      {/* Cuerpo del caballo */}
      <rect x="5" y="11" width="11" height="6" fill={palette.body} />
      <rect x="5" y="15" width="11" height="2" fill={palette.shade} />

      {/* Gualdrapa / silla de torneo */}
      <rect x="8" y="10" width="6" height="4" fill="#b8292f" />
      <rect x="9" y="11" width="4" height="2" fill="#d4af37" />

      {/* Cuello y crin */}
      <rect x="13" y="6" width="4" height="6" fill={palette.body} />
      <rect x="12" y="5" width="2" height="6" fill={palette.mane} />

      {/* Cabeza y hocico */}
      <rect x="15" y="4" width="5" height="4" fill={palette.body} />
      <rect x="19" y="6" width="2" height="2" fill={palette.shade} />
      <rect x="15" y="3" width="2" height="2" fill={palette.body} />
      <rect x="18" y="5" width="1" height="1" fill="#140e0a" />

      {/* Brida dorada */}
      <rect x="16" y="7" width="4" height="1" fill="#d4af37" />

      {/* Patas y cascos */}
      <rect x="6" y="17" width="2" height="4" fill={palette.shade} />
      <rect x="9" y="17" width="2" height="4" fill={palette.body} />
      <rect x="13" y="17" width="2" height="4" fill={palette.shade} />
      <rect x="15" y="17" width="2" height="4" fill={palette.body} />
      <rect x="6" y="20" width="2" height="1" fill="#140e0a" />
      <rect x="9" y="20" width="2" height="1" fill="#140e0a" />
      <rect x="13" y="20" width="2" height="1" fill="#140e0a" />
      <rect x="15" y="20" width="2" height="1" fill="#140e0a" />
    </svg>
  )
}

/** Retrato pixel art de los 3 rivales del torneo */
export function EnemyAvatar({
  enemyCode,
  className = 'w-28 h-28',
}: {
  enemyCode: string
  className?: string
}) {
  const code = enemyCode.toUpperCase()
  const plumeColor =
    code.includes('VALERIE') || code === 'KNIGHT_2'
      ? '#3b7dd8'
      : code.includes('ERK')
        ? '#3ca370'
        : '#b8292f'
  const armorColor =
    code.includes('VALERIE') || code === 'KNIGHT_2'
      ? '#a8b8cc'
      : code.includes('ERK')
        ? '#8c5a3c'
        : '#525b6b'
  const eyeColor =
    code.includes('ERK') ? '#5ec491' : '#f2cf5b'

  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-label={`Retrato pixel art de ${enemyCode}`}
    >
      <rect x="0" y="0" width="24" height="24" fill="#2b2118" />
      <rect x="1" y="1" width="22" height="22" fill="#3d2e22" />
      <rect x="2" y="2" width="20" height="20" fill="#1c140e" />

      {/* Penacho / Yelmo */}
      <rect x="9" y="2" width="6" height="2" fill={plumeColor} />
      <rect x="7" y="4" width="10" height="10" fill="#140e0a" />
      <rect x="8" y="5" width="8" height="8" fill={armorColor} />
      <rect x="8" y="8" width="8" height="2" fill="#140e0a" />
      <rect x="9" y="8" width="2" height="1" fill={eyeColor} />
      <rect x="13" y="8" width="2" height="1" fill={eyeColor} />
      <rect x="11" y="5" width="2" height="8" fill="#d4af37" />

      {/* Coraza enemiga */}
      <rect x="4" y="14" width="16" height="8" fill="#140e0a" />
      <rect x="5" y="15" width="14" height="7" fill={armorColor} />
      <rect x="9" y="15" width="6" height="7" fill={plumeColor} />
      <rect x="11" y="15" width="2" height="7" fill="#d4af37" />
    </svg>
  )
}
