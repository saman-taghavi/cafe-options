import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Kenney's Particle Pack (CC0, kenney.nl) smoke_01 sprite, self-hosted —
// see public/textures/NOTICE.md.
function cloudPuffTextureUrl() {
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${basePath}/textures/cloud-puff.png`
}

// Warm-near / cool-far, not one flat wash — the Howl's-sky trick of
// biasing color by depth instead of by real-time lighting (which is
// what produced the muddy volumetric clumps in the previous pass).
const WARM_TINTS = ['#fff1da', '#ffd9c4', '#f6d3e0']
const COOL_TINTS = ['#e7d8f2', '#dfe3ee', '#e3ddea']

type CardConfig = {
  position: [number, number, number]
  scale: number
  color: string
  opacity: number
  driftSpeed: number
}

/**
 * Individual flat "cloud cards" — the actual production technique
 * documented for recreating Howl's Moving Castle-style skies in a
 * real-time engine (see plan notes): each cloud is one simple unlit
 * billboard sprite, duplicated with its own color/opacity/speed,
 * rather than one dense self-shadowing volumetric object. A `Sprite`
 * with `SpriteMaterial` always faces the camera and never reads scene
 * lighting, so there's no shading path left to turn muddy.
 */
export function CloudCards({ count = 10 }: { count?: number }) {
  const texture = useTexture(cloudPuffTextureUrl())
  const groupRef = useRef<THREE.Group>(null)
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([])

  const cards = useMemo<CardConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const depthT = i / Math.max(1, count - 1) // 0 = nearest, 1 = farthest
      const z = -4 - depthT * 16
      const palette = depthT < 0.5 ? WARM_TINTS : COOL_TINTS
      return {
        position: [(Math.random() - 0.5) * 16, 1 + Math.random() * 3.5, z],
        scale: 2.4 + depthT * 3.2 + Math.random() * 1.2,
        color: palette[i % palette.length],
        opacity: 0.5 - depthT * 0.22 + Math.random() * 0.08,
        driftSpeed: 0.05 + Math.random() * 0.1,
      }
    })
  }, [count])

  useFrame((_, delta) => {
    cards.forEach((card, i) => {
      const sprite = spriteRefs.current[i]
      if (!sprite) return
      sprite.position.x += card.driftSpeed * delta
      if (sprite.position.x > 9) sprite.position.x = -9
    })
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.004
  })

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <sprite
          key={i}
          ref={el => {
            spriteRefs.current[i] = el
          }}
          position={card.position}
          scale={[card.scale, card.scale * 0.62, 1]}
        >
          <spriteMaterial
            map={texture}
            color={card.color}
            transparent
            opacity={card.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}
