import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';

// 1. Separate component for the animated 3D object
const AnimatedTruck = ({ speed }) => {
  const { scene } = useGLTF('/models/truck.gltf');
  const truckRef = useRef();

  // useFrame hooks into the render loop (60+ FPS) without triggering React renders
  useFrame((state, delta) => {
    if (truckRef.current) {
      // Move along the X axis. 'delta' makes it frame-rate independent
      truckRef.current.position.x += speed * delta * 0.1;

      // Loop the truck back to start when it drives out of frame
      if (truckRef.current.position.x > 15) {
        truckRef.current.position.x = -15;
      }
    }
  });

  return (
    <group ref={truckRef}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
};

// Canvas Fallback Loader
const CanvasLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress />
  </Box>
);

const VehicleSimulation = ({ speed = 50, location = 'Unknown' }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Simulation
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 3 }}>
        <Typography variant="body1"><strong>Location:</strong> {location}</Typography>
        <Typography variant="body1" color="primary.main">
          <strong>Speed:</strong> {speed} km/h
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ width: '100%', height: '500px', overflow: 'hidden', borderRadius: 2 }}>
        {/* 3D Canvas */}
        <Suspense fallback={<CanvasLoader />}>
          <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
            {/* Lighting & Environment */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" /> {/* Adds realistic lighting reflections */}

            {/* Truck Model with Animation */}
            <AnimatedTruck speed={speed} />

            {/* Ground Shadow */}
            <ContactShadows 
              position={[0, -0.5, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={2} 
              far={4.5} 
            />

            {/* Controls */}
            <OrbitControls 
              enablePan={false} 
              maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the ground
            />
          </Canvas>
        </Suspense>
      </Paper>
    </Box>
  );
};

// Preload to avoid lag when the component mounts
useGLTF.preload('/models/truck.gltf');

export default VehicleSimulation;