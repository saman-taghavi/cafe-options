export function MapPeek({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-neutral-100 shadow-sm">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
