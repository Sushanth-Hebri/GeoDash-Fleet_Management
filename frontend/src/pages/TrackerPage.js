import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import socket from './socket';
import 'leaflet/dist/leaflet.css';

const MapUpdater = ({ position }) => {
  const map = useMap();
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    // Track map interactions
    const handleMapActivity = () => {
      isUserInteractingRef.current = true;
      lastActivityTimeRef.current = Date.now();

      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set a timer to mark end of interaction after 1 minute of no activity
      inactivityTimerRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 60000); // 60 seconds = 1 minute
    };

    // Listen to various map interaction events
    map.on('drag', handleMapActivity);
    map.on('zoom', handleMapActivity);
    map.on('pinch', handleMapActivity);
    map.on('wheel', handleMapActivity);

    return () => {
      map.off('drag', handleMapActivity);
      map.off('zoom', handleMapActivity);
      map.off('pinch', handleMapActivity);
      map.off('wheel', handleMapActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [map]);

  // Only auto-center when not interacting or after inactivity period
  useEffect(() => {
    if (!isUserInteractingRef.current) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
};

const TrackerPage = () => {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Default to Bangalore

  useEffect(() => {
    socket.on('locationUpdate', (location) => {
      setPosition([location.latitude, location.longitude]);
    });

    return () => socket.off('locationUpdate');
  }, []);

  return (
    <MapContainer center={position} zoom={14} style={{ height: '400px', width: '100%' }}>
      {/* Use OpenStreetMap tiles */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Component to handle map updates with inactivity tracking */}
      <MapUpdater position={position} />
      
      <Marker position={position}>
        <Popup>Driver's Current Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default TrackerPage;
