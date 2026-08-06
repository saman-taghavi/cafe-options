import { ExternalLink } from 'lucide-react'
import { useSound } from '../hooks/useSound'

interface WebsitePreview {
  title?: string
  description?: string
  image?: string
  url: string
}

export function WebsiteCard({ preview }: { preview: WebsitePreview }) {
  const { play } = useSound()

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => play('press')}
      className="flex flex-col mb-6 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
    >
      {preview.image && (
        <div className="w-full h-32 bg-neutral-100">
          <img src={preview.image} alt={preview.title || 'Website preview'} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-semibold text-neutral-900 truncate">
            {preview.title || new URL(preview.url).hostname.replace('www.', '')}
          </p>
          {preview.description && (
            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
              {preview.description}
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
      </div>
    </a>
  )
}
