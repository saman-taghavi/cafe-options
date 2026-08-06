import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WARM_TONES = ['#e8b4b8', '#c5d1a5', '#f4d7da', '#e6c874', '#8a9a5b']

function makeSoftDot(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.7)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * Slow-drifting warm motes — dust caught in golden-hour light, not
 * "particle effects". Loops seamlessly on the Y axis and gently reacts
 * to pointer position via the parent's camera nudge.
 */
export function ParticleField({ count = 90 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const dotTexture = useMemo(() => makeSoftDot(), [])

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2

      color.set(WARM_TONES[i % WARM_TONES.length])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      speeds[i] = 0.08 + Math.random() * 0.18
    }

    return { positions, colors, speeds }
  }, [count])

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (!points) return
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i) + speeds[i] * delta
      posAttr.setY(i, y > 4.6 ? -4.6 : y)
      const x = posAttr.getX(i) + Math.sin((y + i) * 0.6) * delta * 0.05
      posAttr.setX(i, x)
    }
    posAttr.needsUpdate = true
    points.rotation.y += delta * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.32}
        map={dotTexture}
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
