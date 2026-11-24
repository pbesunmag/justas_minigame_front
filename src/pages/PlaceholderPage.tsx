import { useNavigate, useParams } from 'react-router-dom'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelPanel } from '../components/ui/PixelPanel'
import { TournamentCrestSprite } from '../components/ui/PixelSprites'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { saveId } = useParams<{ saveId: string }>()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pixel-bg-pattern flex items-center justify-center p-4 sm:p-8">
      <PixelPanel title={title} className="max-w-xl w-full">
        <div className="flex flex-col items-center text-center space-y-5 py-4">
          <div className="border-4 border-[#140e0a] bg-[#2b2118] p-4 shadow-[4px_4px_0px_#140e0a]">
            <TournamentCrestSprite className="w-20 h-20" />
          </div>

          <p className="font-[var(--font-retro)] text-2xl text-[#f4e6c8]">{description}</p>

          <p className="font-[var(--font-pixel)] text-[10px] text-[#d4af37] uppercase">
            En construcción — Próxima Fase
          </p>

          <div className="pt-2">
            <PixelButton
              variant="gold"
              size="md"
              onClick={() => navigate(saveId ? `/camp/${saveId}` : '/saves')}
            >
              Volver al Campamento
            </PixelButton>
          </div>
        </div>
      </PixelPanel>
    </div>
  )
}
