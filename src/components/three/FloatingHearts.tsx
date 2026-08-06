import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { createHeartGeometry } from './heartGeometry'

const HEART_COLORS = ['#e8b4b8', '#f0c9cc', '#d7e0c3']

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
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0}
          emissive={color}
          emissiveIntensity={0.03}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  )
}

/**
 * A handful of soft, low-poly hearts drifting in the background —
 * the one "sky is your limit" flourish, kept restrained so it reads as
 * ambiance rather than a screensaver.
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
        scale: 0.22 + Math.random() * 0.18,
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
