import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Aplicamos Lazy Loading para mejorar la velocidad de carga inicial
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CreateProduct = lazy(() => import('./pages/CreateProduct'));
const PersonalInventory = lazy(() => import('./pages/PersonalInventory'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const ErrorUserExistsPage = lazy(() => import('./pages/ErrorUserExistsPage'));
const LoginSuccessPage = lazy(() => import('./pages/LoginSuccessPage'));
const PublicShowcase = lazy(() => import('./pages/PublicShowcase'));

// Un loader sencillo para mientras cargan los componentes
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-sabana-light">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-sabana-blue"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Suspense es necesario para que lazy loading funcione */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Rutas de Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />
          <Route path="/error-user-exists" element={<ErrorUserExistsPage />} />

          {/* Rutas de Gestión de Productos */}
          <Route path="/home" element={<PublicShowcase />} />
          <Route path="/inventory" element={<PersonalInventory />} />
          <Route path="/create-product" element={<CreateProduct />} />

          {/* Ruta 404 - Por si escriben cualquier cosa en la URL */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;