import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashBoard from "./pages/Dashboard";
import SignUpForOwner from "./pages/SignUpForOwner";
import LoginPage from "./pages/LoginPage";
import LearnMore from "./pages/LearnMore";
import ChooseTheRole from "./pages/ChooseTheRole";
import SignupForDriver from "./pages/SignUpForDriver";

const AppRoutes = () =>{
    return(
<Router>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/signupforowner" element={<SignUpForOwner />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/dashboard" element={<DashBoard />} />
<Route path="/learnmore" element={<LearnMore />} />
<Route path="/choosetherole" element={<ChooseTheRole />} />
<Route path="/signupfordriver" element={<SignupForDriver />} />
</Routes>
</Router>

        );
    };

export default AppRoutes;