interface SpriteProps {
  className?: string
}

/** Emblema pixel art del torneo: escudo heráldico, corona dorada y lanzas cruzadas */
export function TournamentCrestSprite({ className = 'w-24 h-24' }: SpriteProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* Lanzas cruzadas */}
      <rect x="2" y="2" width="2" height="2" fill="#d4af37" />
      <rect x="4" y="4" width="2" height="2" fill="#c8b698" />
      <rect x="20" y="2" width="2" height="2" fill="#d4af37" />
      <rect x="18" y="4" width="2" height="2" fill="#c8b698" />
      <rect x="3" y="19" width="2" height="2" fill="#5c4033" />
      <rect x="19" y="19" width="2" height="2" fill="#5c4033" />

      {/* Corona */}
      <rect x="7" y="2" width="2" height="2" fill="#d4af37" />
      <rect x="11" y="1" width="2" height="3" fill="#f2cf5b" />
      <rect x="15" y="2" width="2" height="2" fill="#d4af37" />
      <rect x="7" y="4" width="10" height="2" fill="#d4af37" />
      <rect x="8" y="4" width="2" height="1" fill="#b8292f" />
      <rect x="14" y="4" width="2" height="1" fill="#3b7dd8" />

      {/* Borde escudo */}
      <rect x="5" y="6" width="14" height="11" fill="#140e0a" />
      <rect x="6" y="17" width="12" height="2" fill="#140e0a" />
      <rect x="8" y="19" width="8" height="2" fill="#140e0a" />
      <rect x="10" y="21" width="4" height="2" fill="#140e0a" />

      {/* Marco dorado */}
      <rect x="6" y="7" width="12" height="10" fill="#d4af37" />
      <rect x="7" y="17" width="10" height="2" fill="#d4af37" />
      <rect x="9" y="19" width="6" height="2" fill="#d4af37" />
      <rect x="11" y="21" width="2" height="1" fill="#d4af37" />

      {/* Cuarteles heráldicos */}
      <rect x="7" y="8" width="5" height="5" fill="#b8292f" />
      <rect x="12" y="8" width="5" height="5" fill="#3b7dd8" />
      <rect x="7" y="13" width="5" height="4" fill="#3b7dd8" />
      <rect x="12" y="13" width="5" height="4" fill="#b8292f" />
      <rect x="9" y="17" width="6" height="2" fill="#b8292f" />

      {/* Cruz central dorada */}
      <rect x="11" y="8" width="2" height="11" fill="#f2cf5b" />
      <rect x="7" y="12" width="10" height="2" fill="#f2cf5b" />
    </svg>
  )
}

/** Retrato pixel art del caballero en el campamento */
export function KnightPortraitSprite({ className = 'w-32 h-32' }: SpriteProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={className}
      aria-label="Retrato pixel art del caballero"
    >
      {/* Fondo estandarte */}
      <rect x="0" y="0" width="24" height="24" fill="#2b2118" />
      <rect x="1" y="1" width="22" height="22" fill="#3d2e22" />
      <rect x="2" y="2" width="20" height="20" fill="#2b2118" />

      {/* Penacho carmesí */}
      <rect x="10" y="2" width="4" height="2" fill="#b8292f" />
      <rect x="8" y="3" width="3" height="2" fill="#df4b51" />
      <rect x="13" y="3" width="3" height="2" fill="#8f1e23" />

      {/* Yelmo de acero */}
      <rect x="7" y="5" width="10" height="10" fill="#140e0a" />
      <rect x="8" y="6" width="8" height="8" fill="#8d99ae" />
      <rect x="9" y="6" width="3" height="7" fill="#b8c4d4" />
      <rect x="14" y="6" width="2" height="8" fill="#5c677d" />

      {/* Corona / banda dorada del yelmo */}
      <rect x="8" y="7" width="8" height="1" fill="#d4af37" />
      <rect x="11" y="6" width="2" height="8" fill="#d4af37" />

      {/* Visera oscura */}
      <rect x="8" y="9" width="8" height="2" fill="#140e0a" />
      <rect x="9" y="9" width="2" height="1" fill="#f2cf5b" />
      <rect x="13" y="9" width="2" height="1" fill="#f2cf5b" />

      {/* Respiraderos */}
      <rect x="9" y="12" width="1" height="1" fill="#140e0a" />
      <rect x="14" y="12" width="1" height="1" fill="#140e0a" />

      {/* Hombreras y coraza */}
      <rect x="4" y="15" width="16" height="7" fill="#140e0a" />
      <rect x="5" y="16" width="14" height="6" fill="#5c677d" />
      <rect x="6" y="16" width="4" height="5" fill="#8d99ae" />
      <rect x="14" y="16" width="4" height="5" fill="#434c5e" />

      {/* Tabardo carmesí con cruz dorada */}
      <rect x="9" y="16" width="6" height="6" fill="#b8292f" />
      <rect x="11" y="16" width="2" height="6" fill="#d4af37" />
      <rect x="9" y="18" width="6" height="2" fill="#d4af37" />
    </svg>
  )
}

export function SwordIcon({ className = 'w-6 h-6' }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="11" y="2" width="3" height="3" fill="#c8d4e3" />
      <rect x="9" y="4" width="3" height="3" fill="#c8d4e3" />
      <rect x="7" y="6" width="3" height="3" fill="#9aa8ba" />
      <rect x="5" y="8" width="3" height="3" fill="#9aa8ba" />
      <rect x="3" y="7" width="2" height="2" fill="#d4af37" />
      <rect x="7" y="11" width="2" height="2" fill="#d4af37" />
      <rect x="4" y="9" width="3" height="3" fill="#d4af37" />
      <rect x="2" y="11" width="3" height="3" fill="#5c4033" />
    </svg>
  )
}

export function ShieldIcon({ className = 'w-6 h-6' }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="3" y="2" width="10" height="8" fill="#140e0a" />
      <rect x="4" y="10" width="8" height="2" fill="#140e0a" />
      <rect x="6" y="12" width="4" height="2" fill="#140e0a" />
      <rect x="4" y="3" width="8" height="7" fill="#3b7dd8" />
      <rect x="5" y="10" width="6" height="2" fill="#3b7dd8" />
      <rect x="7" y="3" width="2" height="9" fill="#d4af37" />
      <rect x="4" y="6" width="8" height="2" fill="#d4af37" />
    </svg>
  )
}

export function ArmorIcon({ className = 'w-6 h-6' }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="3" y="2" width="10" height="12" fill="#140e0a" />
      <rect x="4" y="3" width="8" height="10" fill="#8d99ae" />
      <rect x="6" y="3" width="4" height="2" fill="#2b2118" />
      <rect x="7" y="5" width="2" height="8" fill="#d4af37" />
      <rect x="4" y="9" width="8" height="2" fill="#5c4033" />
    </svg>
  )
}

export function HorseIcon({ className = 'w-6 h-6' }: SpriteProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="8" y="2" width="4" height="3" fill="#8c5a3c" />
      <rect x="11" y="3" width="3" height="3" fill="#8c5a3c" />
      <rect x="6" y="5" width="6" height="5" fill="#8c5a3c" />
      <rect x="3" y="7" width="8" height="4" fill="#70442a" />
      <rect x="4" y="11" width="2" height="3" fill="#5c4033" />
      <rect x="9" y="11" width="2" height="3" fill="#5c4033" />
      <rect x="7" y="3" width="2" height="4" fill="#140e0a" />
      <rect x="12" y="4" width="1" height="1" fill="#140e0a" />
      <rect x="6" y="7" width="3" height="2" fill="#d4af37" />
    </svg>
  )
}

export function CoinIcon({ className = 'w-5 h-5' }: SpriteProps) {
  return (
    <svg viewBox="0 0 12 12" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="3" y="1" width="6" height="10" fill="#140e0a" />
      <rect x="1" y="3" width="10" height="6" fill="#140e0a" />
      <rect x="3" y="2" width="6" height="8" fill="#d4af37" />
      <rect x="2" y="3" width="8" height="6" fill="#d4af37" />
      <rect x="4" y="3" width="2" height="5" fill="#f2cf5b" />
    </svg>
  )
}

export function SkullIcon({ className = 'w-5 h-5' }: SpriteProps) {
  return (
    <svg viewBox="0 0 12 12" shapeRendering="crispEdges" className={className} aria-hidden="true">
      <rect x="2" y="1" width="8" height="7" fill="#f4e6c8" />
      <rect x="3" y="8" width="6" height="2" fill="#f4e6c8" />
      <rect x="3" y="4" width="2" height="2" fill="#140e0a" />
      <rect x="7" y="4" width="2" height="2" fill="#140e0a" />
      <rect x="5" y="6" width="2" height="1" fill="#140e0a" />
      <rect x="4" y="9" width="1" height="1" fill="#140e0a" />
      <rect x="7" y="9" width="1" height="1" fill="#140e0a" />
    </svg>
  )
}
