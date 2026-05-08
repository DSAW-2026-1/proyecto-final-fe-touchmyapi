import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProduct from './pages/CreateProduct';
import PersonalInventory from './pages/PersonalInventory';
import SuccessPage from './pages/SuccessPage';
import ErrorUserExistsPage from './pages/ErrorUserExistsPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import PublicShowcase from './pages/PublicShowcase';


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Si entran a la raíz, los manda al login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Definimos las rutas oficiales */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/showcase" element={<PublicShowcase />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/inventory" element={<PersonalInventory />} />
        
        <Route path="/success" element={<SuccessPage />} />

        <Route path="/error-user-exists" element={<ErrorUserExistsPage />} />

        <Route path="/login-success" element={<LoginSuccessPage />} />

        <Route path="/personal-inventory" element={<PersonalInventory />} />

        <Route path="/create-product" element={<CreateProduct />} />

        <Route path="/home" element={<PublicShowcase />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
