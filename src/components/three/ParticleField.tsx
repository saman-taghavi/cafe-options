import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WARM_TONES = ['#f2a6ac', '#d7e2ae', '#f9d9e2', '#ffd98c', '#a8c9d6']

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

  const { positions, colors, speeds, baseColors, twinklePhase, twinkleSpeed } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const baseColors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const twinklePhase = new Float32Array(count)
    const twinkleSpeed = new Float32Array(count)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2

      color.set(WARM_TONES[i % WARM_TONES.length])
      baseColors[i * 3] = color.r
      baseColors[i * 3 + 1] = color.g
      baseColors[i * 3 + 2] = color.b
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      speeds[i] = 0.08 + Math.random() * 0.18
      twinklePhase[i] = Math.random() * Math.PI * 2
      twinkleSpeed[i] = 0.6 + Math.random() * 0.9
    }

    return { positions, colors, speeds, baseColors, twinklePhase, twinkleSpeed }
  }, [count])

  const clock = useRef(0)

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (!points) return
    clock.current += delta
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute
    const colorAttr = points.geometry.attributes.color as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i) + speeds[i] * delta
      posAttr.setY(i, y > 4.6 ? -4.6 : y)
      const x = posAttr.getX(i) + Math.sin((y + i) * 0.6) * delta * 0.05
      posAttr.setX(i, x)

      // Gentle per-mote twinkle — soot-sprite aliveness rather than a
      // uniformly glowing dust cloud.
      const glow = 0.55 + 0.45 * Math.sin(clock.current * twinkleSpeed[i] + twinklePhase[i])
      colorAttr.setXYZ(i, baseColors[i * 3] * glow, baseColors[i * 3 + 1] * glow, baseColors[i * 3 + 2] * glow)
    }
    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true
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
