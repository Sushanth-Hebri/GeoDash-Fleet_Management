import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import socket from './socket';
import 'leaflet/dist/leaflet.css';

const TrackerPage = () => {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Default to Bangalore

  useEffect(() => {
    socket.on('locationUpdate', (location) => {
      setPosition([location.latitude, location.longitude]);
    });

    return () => socket.off('locationUpdate');
  }, []);

  return (
    <MapContainer center={position} zoom={14} style={{ height: '500px', width: '100%' }}>
      {/* Use OpenStreetMap tiles */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={position}>
        <Popup>Driver's Current Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default TrackerPage;
