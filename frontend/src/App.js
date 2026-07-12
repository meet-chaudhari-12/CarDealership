import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';

// Layout that displays Navbar with page content
const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

