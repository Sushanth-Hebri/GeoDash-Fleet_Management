import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import LearnMore from "./pages/LearnMore";

const AppRoutes = () =>{
    return(
<Router>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/signup" element={<SignUp />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/dashboard" element={<DashBoard />} />
<Route path="/learnmore" element={<LearnMore />} />
</Routes>
</Router>

        );
    };

export default AppRoutes;