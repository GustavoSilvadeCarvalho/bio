"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Environment } from '@react-three/drei'

function RotatingModel({ src = '/logo.glb', scale = 1 }) {
    const gltf = useGLTF(src)
    const ref = useRef<any>(null)
    useFrame((state, dt) => {
        if (ref.current) ref.current.rotation.y += dt * 2.0
    })
    return <primitive ref={ref} object={gltf.scene} scale={scale} />
}

export default function LogoGLB({ size = 48, ambient = 20, directional = 20, showEnv = false }: { size?: number; ambient?: number; directional?: number; showEnv?: boolean }) {
    return (
        <div style={{ width: size, height: size, pointerEvents: 'none' }}>
            <Canvas gl={{ alpha: true }} camera={{ fov: 45, position: [0, 0, 3] }}>
                <ambientLight intensity={ambient} />
                <directionalLight intensity={directional} position={[5, 5, 5]} />
                <pointLight intensity={0.3} position={[-3, -3, 3]} />
                {showEnv && <Environment preset="sunset" background={false} />}
                <RotatingModel src="/logo.glb" scale={0.1} />
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
            </Canvas>
        </div>
    )
}
