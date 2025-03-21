import React, { useEffect } from 'react';
import socket from './socket';

const DriverPage = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location:', latitude, longitude, `Accuracy: ${accuracy} meters`);
          socket.emit('updateLocation', { latitude, longitude });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return <h2>Driver location is being shared in real-time!</h2>;
};

export default DriverPage;
