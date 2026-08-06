import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { createHeartGeometry } from './heartGeometry'

// Warm, saturated, storybook tones — a hand-painted keepsake, not a
// jewelry-store gem render.
const HEART_COLORS = ['#f2a6ac', '#f6c9a0', '#c9d9a0', '#f0d689']

function HeartGem({
  position,
  color,
  scale,
  floatSpeed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  floatSpeed: number
}) {
  const geometry = useMemo(() => createHeartGeometry(), [])
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.25
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.35} floatIntensity={1.1}>
      <mesh ref={meshRef} geometry={geometry} position={position} scale={scale}>
        {/* Unlit flat color — a painted paper cutout, not a physically-lit
            ornament. MeshBasicMaterial ignores scene lighting entirely,
            so it always reads as the same clean flat color regardless of
            angle (MeshToonMaterial's lit banding read as a grey smudge
            from some angles — this is the fix). */}
        <meshBasicMaterial color={color} transparent opacity={0.92} />
      </mesh>
    </Float>
  )
}

/**
 * A handful of soft, storybook hearts drifting in the background —
 * paper-cutout charm rather than a jewelry render. Restrained enough to
 * read as ambiance.
 */
export function FloatingHearts({ count = 4 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          -3.5 - Math.random() * 2.5,
        ] as [number, number, number],
        color: HEART_COLORS[i % HEART_COLORS.length],
        scale: 0.24 + Math.random() * 0.2,
        floatSpeed: 0.6 + Math.random() * 0.8,
      })),
    [count],
  )

  return (
    <>
      {hearts.map((h, i) => (
        <HeartGem key={i} {...h} />
      ))}
    </>
  )
}
