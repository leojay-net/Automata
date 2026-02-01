'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Geometries() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.001;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                <mesh position={[2, 2, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#333" wireframe />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
                <mesh position={[-2, -1, -2]}>
                    <octahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#444" wireframe />
                </mesh>
            </Float>
            <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
                <mesh position={[0, 3, -5]}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#222" wireframe />
                </mesh>
            </Float>
        </group>
    );
}

export default function Background() {
    return (
        <div className="fixed inset-0 z-[-1] bg-neutral-950">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <fog attach="fog" args={['#0a0a0a', 5, 20]} />
                <ambientLight intensity={0.5} />
                <Geometries />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
