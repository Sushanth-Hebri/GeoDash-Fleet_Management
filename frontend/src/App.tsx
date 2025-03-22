import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRoutes from './routes';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';


function App() {
  return (
    <AppRoutes />
  );
}

export default App;


// import React, { useState } from 'react';
// import DriverPage from './pages/DriverPage';
// import TrackerPage from './pages/TrackerPage';

// function App() {
//   const [isDriver, setIsDriver] = useState(false);

//   return (
//     <div>
//       <button onClick={() => setIsDriver(!isDriver)}>
//         {isDriver ? 'Switch to Tracker' : 'Switch to Driver'}
//       </button>
//       {isDriver ? <DriverPage /> : <TrackerPage />}
//     </div>
//   );
// }

// export default App;


