import * as THREE from 'three'

/**
 * A warm little "sun" tucked behind the clouds — the Totoro-forest-light,
 * Castle-in-the-Sky glow. It barely reads as a shape on its own (the
 * clouds sit in front of it); it exists so `<GodRays sun={...}>` (wired
 * up in AmbientCanvas, inside the EffectComposer) has a real light
 * source to trace shafts from.
 *
 * This has to be a normal scene mesh, not a child of EffectComposer —
 * effects there rewrite the render pipeline and won't render plain
 * geometry — so the resolved instance is reported up via `onReady`
 * (called once, after mount) rather than rendered alongside the effect.
 */
export function SunMesh({ onReady }: { onReady: (mesh: THREE.Mesh) => void }) {
  return (
    <mesh
      ref={mesh => {
        if (mesh) onReady(mesh)
      }}
      position={[3.5, 3.4, -16]}
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#fff1d0" toneMapped={false} transparent opacity={0.55} />
    </mesh>
  )
}
