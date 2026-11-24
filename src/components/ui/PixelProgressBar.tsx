export type PixelBarTone = 'hp' | 'stamina' | 'shield' | 'xp'

interface PixelProgressBarProps {
  label: string
  current: number
  max: number
  tone?: PixelBarTone
  segmented?: boolean
  className?: string
}

const TONE_FILL: Record<PixelBarTone, string> = {
  hp: 'bg-[#b8292f]',
  stamina: 'bg-[#3ca370]',
  shield: 'bg-[#3b7dd8]',
  xp: 'bg-[#d4af37]',
}

const TONE_HIGHLIGHT: Record<PixelBarTone, string> = {
  hp: 'bg-[#df4b51]',
  stamina: 'bg-[#5ec491]',
  shield: 'bg-[#66a2f0]',
  xp: 'bg-[#f2cf5b]',
}

export function PixelProgressBar({
  label,
  current,
  max,
  tone = 'hp',
  segmented = true,
  className = '',
}: PixelProgressBarProps) {
  const safeMax = Math.max(max, 1)
  const clamped = Math.max(0, Math.min(current, safeMax))
  const percent = Math.round((clamped / safeMax) * 100)

  return (
    <div
      className={`relative h-8 w-full border-4 border-[#140e0a] bg-[#1e1610] shadow-[3px_3px_0px_#140e0a] rounded-none overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={`${label}: ${current}/${max}`}
    >
      {/* Barra de relleno */}
      <div
        className={`h-full transition-all duration-300 relative ${TONE_FILL[tone]}`}
        style={{ width: `${percent}%` }}
      >
        <div className={`h-1.5 w-full ${TONE_HIGHLIGHT[tone]} opacity-70`} />
      </div>

      {/* Divisiones segmentadas pixel art */}
      {segmented && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(20, 14, 10, 0.45) 18px, rgba(20, 14, 10, 0.45) 20px)',
          }}
        />
      )}

      {/* Texto superpuesto */}
      <div className="absolute inset-0 flex items-center justify-center px-2">
        <span className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-[#f4e6c8] pixel-text-shadow-sm tracking-wide">
          {label}: {current}/{max}
        </span>
      </div>
    </div>
  )
}
