import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type PixelButtonVariant = 'primary' | 'danger' | 'gold' | 'disabled'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: PixelButtonVariant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<PixelButtonVariant, string> = {
  primary:
    'bg-[#3b7dd8] hover:bg-[#4c8ee8] text-[#f4e6c8] border-[#140e0a] shadow-[4px_4px_0px_#140e0a] active:translate-y-1 active:shadow-[0px_0px_0px_#140e0a]',
  danger:
    'bg-[#b8292f] hover:bg-[#cf343a] text-[#f4e6c8] border-[#140e0a] shadow-[4px_4px_0px_#140e0a] active:translate-y-1 active:shadow-[0px_0px_0px_#140e0a]',
  gold:
    'bg-[#d4af37] hover:bg-[#e5c14b] text-[#140e0a] border-[#140e0a] shadow-[4px_4px_0px_#140e0a] active:translate-y-1 active:shadow-[0px_0px_0px_#140e0a]',
  disabled:
    'bg-[#4a3c31] text-[#8c7860] border-[#140e0a] shadow-[2px_2px_0px_#140e0a] cursor-not-allowed opacity-75',
}

const SIZE_CLASSES = {
  sm: 'px-3 py-2 text-[10px]',
  md: 'px-4 py-3 text-xs',
  lg: 'px-6 py-4 text-xs sm:text-sm',
}

export function PixelButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}: PixelButtonProps) {
  const effectiveVariant: PixelButtonVariant = disabled ? 'disabled' : variant
  const isDisabled = disabled || variant === 'disabled'

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        border-4 rounded-none
        font-[var(--font-pixel)] uppercase tracking-wide
        transition-transform duration-75
        select-none cursor-pointer
        ${VARIANT_CLASSES[effectiveVariant]}
        ${SIZE_CLASSES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}
