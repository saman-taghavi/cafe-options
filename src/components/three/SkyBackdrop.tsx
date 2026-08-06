import * as THREE from 'three'
import { GradientTexture } from '@react-three/drei'

/**
 * A big inside-out sphere painted with a soft warm-to-lavender gradient —
 * the "hand-painted backdrop" behind the clouds. Ghibli skies are never
 * a flat photographic blue; they're a wash of two or three warm/cool
 * tones bleeding into each other. This is that wash.
 */
export function SkyBackdrop() {
  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[28, 24, 24]} />
      {/* Barely a tint — this only has to nudge the paper-cream page
          background toward "sky", never compete with it. It sits behind
          content that's mostly opaque UI, so even a small amount reads
          strongly in the gaps; anything past ~0.15 opacity turns into a
          haze that fights the cards for attention. */}
      <meshBasicMaterial side={THREE.BackSide} toneMapped={false} transparent opacity={0.14}>
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={['#fbead2', '#f8e2e4', '#ece3f0']}
          size={128}
        />
      </meshBasicMaterial>
    </mesh>
  )
}
