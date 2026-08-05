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

  return (
    <div className="flex justify-center my-4 overflow-hidden rounded-xl w-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${url}?utm_source=ig_embed&ig_rid=foo`}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: '99.375%',
        }}
      ></blockquote>
    </div>
  )
}
