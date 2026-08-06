import * as THREE from 'three'

/**
 * A real parametric heart curve (the classic
 * x = 16 sin³t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t equation),
 * sampled into a closed polygon and extruded. Unlike a hand-guessed
 * bezier outline, this always reads as an actual heart silhouette from
 * any rotation, not a pair of overlapping blobs.
 */
export function createHeartGeometry(depth = 0.4) {
  const shape = new THREE.Shape()
  const steps = 48
  const scale = 1 / 16

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.sin(t) ** 3
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const px = x * scale
    const py = y * scale
    if (i === 0) shape.moveTo(px, py)
    else shape.lineTo(px, py)
  }
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 1,
  })
  geometry.center()
  return geometry
}
