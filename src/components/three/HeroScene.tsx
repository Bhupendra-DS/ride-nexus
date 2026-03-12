import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CarModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main car body */}
      <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.4, 0.55, 1.1]} />
        <meshStandardMaterial
          color="#0a0e1a"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Cabin */}
      <mesh position={[0.1, 0.45, 0]}>
        <boxGeometry args={[1.4, 0.45, 1.0]} />
        <meshStandardMaterial
          color="#080c18"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.72, 0.42, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.6, 0.42]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          metalness={0.0}
          roughness={0.0}
          transmission={0.9}
          opacity={0.4}
          transparent
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[-0.58, 0.42, 0]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.5, 0.42]} />
        <meshPhysicalMaterial
          color="#00d4ff"
          metalness={0.0}
          roughness={0.0}
          transmission={0.9}
          opacity={0.4}
          transparent
        />
      </mesh>

      {/* Front wheels */}
      <mesh position={[0.9, -0.38, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.9, -0.38, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rear wheels */}
      <mesh position={[-0.9, -0.38, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.9, -0.38, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wheel rims */}
      {[[0.9, -0.38, 0.62], [0.9, -0.38, -0.62], [-0.9, -0.38, 0.62], [-0.9, -0.38, -0.62]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
          <meshStandardMaterial color="#00d4ff" metalness={1} roughness={0.1} emissive="#00d4ff" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Headlights */}
      <mesh position={[1.2, 0.05, 0.38]}>
        <boxGeometry args={[0.05, 0.08, 0.22]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[1.2, 0.05, -0.38]}>
        <boxGeometry args={[0.05, 0.08, 0.22]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.22, 0.05, 0.38]}>
        <boxGeometry args={[0.05, 0.06, 0.22]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-1.22, 0.05, -0.38]}>
        <boxGeometry args={[0.05, 0.06, 0.22]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} />
      </mesh>

      {/* Ground reflection plane */}
      <mesh position={[0, -0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#00d4ff" metalness={0} roughness={1} opacity={0.04} transparent />
      </mesh>
    </group>
  );
};

const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 80;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00d4ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

export const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      style={{ background: 'transparent' }}
      shadows
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow color="#ffffff" />
      <pointLight position={[-3, 2, -3]} intensity={2} color="#00d4ff" />
      <pointLight position={[3, -1, 2]} intensity={1} color="#0044ff" />
      <spotLight position={[0, 6, 0]} intensity={1.5} angle={0.4} penumbra={0.8} color="#ffffff" />

      <CarModel />
      <FloatingParticles />

      <Environment preset="night" />
    </Canvas>
  );
};
