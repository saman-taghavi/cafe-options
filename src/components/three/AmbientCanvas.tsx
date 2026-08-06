import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { ParticleField } from './ParticleField'
import { FloatingHearts } from './FloatingHearts'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

function PointerParallax({ strength = 0.4 }: { strength?: number }) {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * strength
      target.current.y = (e.clientY / window.innerHeight - 0.5) * strength
    }
    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [strength])

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.04
    camera.position.y += (-target.current.y - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * The ambient "golden-hour scrapbook" background: warm drifting motes +
 * a few soft heart gems, with gentle pointer parallax. Mounted client-side
 * only, skipped entirely under reduced-motion or on very small/low-power
 * screens where it would just be battery drain, not delight.
 */
export function AmbientCanvas({
  className,
  heartCount = 4,
  particleCount,
}: {
  className?: string
  heartCount?: number
  particleCount?: number
}) {
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640
  const resolvedParticles = particleCount ?? (isSmallScreen ? 40 : 90)
  const resolvedHearts = isSmallScreen ? Math.min(2, heartCount) : heartCount

  const dpr = useMemo<[number, number]>(() => (isSmallScreen ? [1, 1.25] : [1, 1.75]), [isSmallScreen])

  if (!mounted || reducedMotion) return null

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[3, 3, 4]} intensity={0.6} color="#f4d7da" />
        <Suspense fallback={null}>
          <ParticleField count={resolvedParticles} />
          <FloatingHearts count={resolvedHearts} />
          {!isSmallScreen && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.35}
                luminanceThreshold={0.45}
                luminanceSmoothing={0.6}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.25} darkness={0.3} />
            </EffectComposer>
          )}
        </Suspense>
        <PointerParallax />
      </Canvas>
    </div>
  )
}
