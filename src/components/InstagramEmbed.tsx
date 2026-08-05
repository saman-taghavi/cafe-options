import { useEffect, useState } from 'react'
import { Camera, ExternalLink } from 'lucide-react'

export function InstagramEmbed({ url }: { url: string }) {
  const isProfile = !url.includes('/p/') && !url.includes('/reel/') && !url.includes('/tv/')

  useEffect(() => {
    if (!isProfile) {
      // @ts-ignore
      if (window.instgrm) {
        // @ts-ignore
        window.instgrm.Embeds.process()
      }
    }
  }, [url, isProfile])

  if (isProfile) {
    return (
      <div className="flex flex-col items-center justify-center my-4 p-8 bg-white border border-neutral-200 rounded-2xl w-full max-w-[540px]">
        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 rounded-full p-[2px] mb-4">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-neutral-800" />
          </div>
        </div>
        <h3 className="font-semibold text-neutral-900 mb-1">Instagram Profile</h3>
        <p className="text-neutral-500 text-sm mb-6 text-center">Open this profile on Instagram to see their latest photos, reels, and updates.</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium text-sm transition-transform active:scale-95"
        >
          View Profile <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  const cleanUrl = url.replace(/\/?(\?.*)?$/, '')
  // Strip out the username part if it accidentally exists e.g., /arianaartcafe/p/... -> /p/...
  const instagramPostIdMatch = cleanUrl.match(/\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/)
  
  const embedSrc = instagramPostIdMatch 
    ? `https://www.instagram.com/${instagramPostIdMatch[1]}/${instagramPostIdMatch[2]}/embed`
    : `${cleanUrl}/embed`

  return (
    <div className="flex justify-center my-4 overflow-hidden rounded-xl w-full">
      <iframe
        src={embedSrc}
        width="100%"
        height="500"
        style={{ border: 'none', overflow: 'hidden' }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        scrolling="no"
      ></iframe>
    </div>
  )
}
