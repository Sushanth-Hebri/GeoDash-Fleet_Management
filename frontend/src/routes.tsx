import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Existing Imports
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/Dashboard";
import SignUpForOwner from "./pages/SignUpForOwner";
import LoginPage from "./pages/LoginPage";
import LearnMore from "./pages/LearnMore";
import ChooseTheRole from "./pages/ChooseTheRole";
import SignupForDriver from "./pages/SignUpForDriver";
import Pricing from "./pages/Pricing";

// New Page Imports (To be created)
import VehicleInventory from "./pages/vehicles/VehicleInventory";
import VehicleDetails from "./pages/vehicles/VehicleDetails";
import DriverManagement from "./pages/drivers/DriverManagement";
import LiveTracking from "./pages/tracking/LiveTracking";
import AnalyticsReports from "./pages/reports/AnalyticsReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  // Mock authentication check
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* AUTH ROUTES */}
        <Route path="/choosetherole" element={<ChooseTheRole />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signupforowner" element={<SignUpForOwner />} />
        <Route path="/signupfordriver" element={<SignupForDriver />} />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />} 
        />
        
        {/* VEHICLE MANAGEMENT */}
        <Route path="/vehicles" element={<VehicleInventory />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} /> {/* Dynamic Route */}
        
        {/* DRIVER MANAGEMENT */}
        <Route path="/drivers" element={<DriverManagement />} />
        
        {/* MONITORING & ANALYTICS */}
        <Route path="/live-tracking" element={<LiveTracking />} />
        <Route path="/reports" element={<AnalyticsReports />} />
        
        {/* ACCOUNT & SYSTEM */}
        <Route path="/settings" element={<Settings />} />

        {/* 404 PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;