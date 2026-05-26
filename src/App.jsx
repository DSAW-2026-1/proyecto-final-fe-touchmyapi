import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './context/NotificationContext';


const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CreateProduct = lazy(() => import('./pages/CreateProduct'));
const PersonalInventory = lazy(() => import('./pages/PersonalInventory'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const ErrorUserExistsPage = lazy(() => import('./pages/ErrorUserExistsPage'));
const LoginSuccessPage = lazy(() => import('./pages/LoginSuccessPage'));
const PublicShowcase = lazy(() => import('./pages/PublicShowcase'));
const AdminDashboard = lazy(()=> import('./pages/AdminDashboard'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const ChatPage = lazy(() => import('./pages/ChatPage')); 

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-sabana-light">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-sabana-blue"></div>
  </div>
);

function App() {
  return (
    <AuthProvider> 
      <NotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/login-success" element={<LoginSuccessPage />} />
                <Route path="/error-user-exists" element={<ErrorUserExistsPage />} />

                <Route path="/home" element={<PublicShowcase />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/password" element={<ChangePassword />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/PersonalInventory" element={<PersonalInventory />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/cart-page" element={<CartPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />

                <Route 
                  path="/admin-control" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard/>
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;