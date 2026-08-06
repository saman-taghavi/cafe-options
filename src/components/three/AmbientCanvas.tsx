import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, GodRays } from '@react-three/postprocessing'
import * as THREE from 'three'
import { ParticleField } from './ParticleField'
import { FloatingHearts } from './FloatingHearts'
import { CloudCards } from './CloudCards'
import { SkyBackdrop } from './SkyBackdrop'
import { SunMesh } from './SunMesh'
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
 * The ambient "Howl's-sky" background: a hand-painted gradient wash,
 * individual flat cloud cards drifting past (warm near, cool-grey far —
 * the actual production technique for this look, not a lit volumetric
 * render — see the plan notes this was built from), soft god-ray light
 * shafts, and a scatter of twinkling spirit-mote particles and paper
 * hearts. Every element is deliberately unlit (MeshBasicMaterial /
 * SpriteMaterial / PointsMaterial) — there are no scene lights, because
 * nothing here reads them; depth instead comes from fog and from each
 * element's own baked-in tint. Mounted client-side only, skipped
 * entirely under reduced-motion or on very small/low-power screens.
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
  const [sun, setSun] = useState<THREE.Mesh | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640
  const resolvedParticles = particleCount ?? (isSmallScreen ? 40 : 90)
  const resolvedHearts = isSmallScreen ? Math.min(2, heartCount) : heartCount
  const resolvedClouds = isSmallScreen ? 6 : 10

  const dpr = useMemo<[number, number]>(() => (isSmallScreen ? [1, 1.25] : [1, 1.75]), [isSmallScreen])

  if (!mounted || reducedMotion) return null

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Distance fade toward the sky's cool tone — the documented
            "fog for depth" technique, standing in for the lighting/
            shadowing that made the previous attempt muddy. */}
        <fog attach="fog" args={['#ece3ee', 10, 24]} />
        <Suspense fallback={null}>
          <SkyBackdrop />
          <CloudCards count={resolvedClouds} />
          <SunMesh onReady={setSun} />
          <ParticleField count={resolvedParticles} />
          <FloatingHearts count={resolvedHearts} />
          {!isSmallScreen && sun && (
            <EffectComposer multisampling={0}>
              <GodRays
                sun={sun}
                samples={24}
                density={0.7}
                decay={0.9}
                weight={0.2}
                exposure={0.12}
                clampMax={0.6}
                kernelSize={2}
                blur
              />
              <Bloom intensity={0.3} luminanceThreshold={0.62} luminanceSmoothing={0.6} mipmapBlur />
              <Vignette eskil={false} offset={0.3} darkness={0.22} />
            </EffectComposer>
          )}
        </Suspense>
        <PointerParallax />
      </Canvas>
    </div>
  )
}
