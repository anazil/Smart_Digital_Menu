import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TablePage from "./pages/TablePage";
import AdminMenuPage from "./pages/AdminMenuPage";
import TableAdmin from "./pages/TableAdmin";
import KitchenPage from "./pages/KitchenPage";
import HallScreenPage from "./pages/HallScreenPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OrderSucess from "./pages/OrderSucess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />   
        <Route path="/table/:tableNumber/:userId" element={<TablePage />} />
        <Route path="/admin/:userId" element={<AdminMenuPage/>}/>
        <Route path='/tableadmin/:userId' element={<TableAdmin/>}/>
        <Route path='/kitchenpage/:userId' element={<KitchenPage/>}/>
        <Route path='/hallscreen/:userId' element={<HallScreenPage/>}/>
        <Route path='/dash/:userId' element={<AdminDashboard/>}/>
        <Route path='/settings/:userId' element={<SettingsPage/>}/>
         <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ordersuccess" element={<OrderSucess />} />
      </Routes>
    </Router>
  );
}

export default App;
