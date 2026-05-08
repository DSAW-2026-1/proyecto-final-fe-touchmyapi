import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProduct from './pages/CreateProduct';
import PersonalInventory from './pages/PersonalInventory';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Si entran a la raíz, los manda al login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Definimos las rutas oficiales */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-product" element={<CreateProduct />} />
        {/* Inventario personal */}
        <Route path="/inventory" element={<PersonalInventory />} />
        
        <Route path="/success" element={<SuccessPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
