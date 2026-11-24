import { useEffect, useState, type ReactNode } from 'react'
import { PixelButton } from './PixelButton'

interface DialogueBoxProps {
  speaker: string
  text: string
  portrait?: ReactNode
  speedMs?: number
  actionLabel?: string
  onAction?: () => void
  actionDisabled?: boolean
  className?: string
}

export function DialogueBox({
  speaker,
  text,
  portrait,
  speedMs = 22,
  actionLabel,
  onAction,
  actionDisabled = false,
  className = '',
}: DialogueBoxProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    if (!text) return

    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          window.clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, speedMs)

    return () => window.clearInterval(interval)
  }, [text, speedMs])

  const isTyping = visibleCount < text.length
  const displayedText = text.slice(0, visibleCount)

  const handleBoxClick = () => {
    if (isTyping) {
      setVisibleCount(text.length)
    }
  }

  return (
    <div
      onClick={handleBoxClick}
      className={`border-4 border-[#140e0a] bg-[#d4af37] p-1 shadow-[4px_4px_0px_#140e0a] rounded-none ${
        isTyping ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="border-4 border-[#5c4033] bg-[#221912] p-4 flex flex-col sm:flex-row items-start gap-4">
        {portrait && (
          <div className="border-4 border-[#140e0a] bg-[#3d2e22] p-1 shrink-0 shadow-[3px_3px_0px_#140e0a]">
            {portrait}
          </div>
        )}

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2 border-b-2 border-[#5c4033] pb-1 mb-2">
            <span className="font-[var(--font-pixel)] text-[10px] sm:text-xs text-[#d4af37] uppercase tracking-wider">
              {speaker}
            </span>
            {isTyping && (
              <span className="font-[var(--font-retro)] text-base text-[#8c7860]">
                (clic para saltar)
              </span>
            )}
          </div>

          <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8] leading-snug min-h-[3.5rem]">
            {displayedText}
            {isTyping && <span className="inline-block ml-1 text-[#d4af37]">▌</span>}
          </p>

          {actionLabel && onAction && (
            <div className="mt-4 flex justify-end">
              <PixelButton
                variant="gold"
                size="sm"
                disabled={actionDisabled}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isTyping) {
                    setVisibleCount(text.length)
                    return
                  }
                  onAction()
                }}
              >
                {actionLabel}
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
