import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Typography, Box } from '@mui/material';

// Truck Model Component
const TruckModel = () => {
  const { scene } = useGLTF('/models/truck.gltf');
  return <primitive object={scene} scale={1.5} />;
};

const VehicleSimulation = ({ speed = 50, location = 'Unknown' }) => {
  const [position, setPosition] = useState([0, 0, 0]);

  // Simulate movement based on speed
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => [prev[0] + speed * 0.02, prev[1], prev[2]]);
    }, 100);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Vehicle Simulation
      </Typography>
      <Typography>Location: {location}</Typography>
      <Typography>Speed: {speed} km/h</Typography>
      
      {/* 3D Canvas */}
      <Canvas style={{ width: '100%', height: '500px' }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Truck Model */}
        <group position={position}>
          <TruckModel />
        </group>

        {/* Orbit Controls */}
        <OrbitControls />
      </Canvas>
    </Box>
  );
};

// Preloading the GLTF to avoid lag
useGLTF.preload('/models/truck.gltf');

export default VehicleSimulation;
