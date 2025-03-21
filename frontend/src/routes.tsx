import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashBoard from "./pages/Dashboard";

const AppRoutes = () =>{
    return(
<Router>
<Routes>
<Route path="/" element={<LoginPage />} />
<Route path="/dashboard" element={<DashBoard />} />
</Routes>
</Router>

        );
    };

export default AppRoutes;