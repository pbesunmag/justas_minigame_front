import type { ReactNode } from 'react'

interface PixelPanelProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  bodyClassName?: string
  variant?: 'default' | 'wood' | 'dark'
}

export function PixelPanel({
  children,
  title,
  subtitle,
  className = '',
  bodyClassName = '',
  variant = 'default',
}: PixelPanelProps) {
  const bgByVariant = {
    default: 'bg-[#3d2e22]',
    wood: 'bg-[#5c4033]',
    dark: 'bg-[#2b2118]',
  }[variant]

  return (
    <div
      className={`relative border-4 border-[#140e0a] p-1 bg-[#d4af37] shadow-[4px_4px_0px_#140e0a] rounded-none ${className}`}
    >
      <div className={`border-4 border-[#5c4033] ${bgByVariant} relative rounded-none`}>
        {/* Remaches dorados en las 4 esquinas */}
        <span className="pointer-events-none absolute top-1 left-1 w-2 h-2 bg-[#d4af37] border border-[#140e0a]" />
        <span className="pointer-events-none absolute top-1 right-1 w-2 h-2 bg-[#d4af37] border border-[#140e0a]" />
        <span className="pointer-events-none absolute bottom-1 left-1 w-2 h-2 bg-[#d4af37] border border-[#140e0a]" />
        <span className="pointer-events-none absolute bottom-1 right-1 w-2 h-2 bg-[#d4af37] border border-[#140e0a]" />

        {title && (
          <div className="border-b-4 border-[#140e0a] bg-[#2b2118] px-5 py-3">
            <h2 className="font-[var(--font-pixel)] text-xs sm:text-sm text-[#d4af37] tracking-wider uppercase pixel-text-shadow-sm">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 font-[var(--font-retro)] text-xl text-[#c8b698]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`p-5 ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  )
}
