import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";

const AppRoutes = () =>{
    return(
<Router>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/signup" element={<SignUp />} />
<Route path="/dashboard" element={<DashBoard />} />
</Routes>
</Router>

        );
    };

export default AppRoutes;