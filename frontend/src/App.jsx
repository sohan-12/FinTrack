import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { UpiBanking } from './pages/UpiBanking';
import { Transactions } from './pages/Transactions';
import { AddTransaction } from './pages/AddTransaction';
import { AiAssistant } from './pages/AiAssistant';
import { HelpSupport } from './pages/HelpSupport';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

const AppLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-wrapper">{children}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Application Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upi-banking"
              element={
                <ProtectedRoute>
                  <UpiBanking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-transaction"
              element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AiAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help-support"
              element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes (Segregated from standard users) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Default Redirection */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
        <Toast />
      </BrowserRouter>
    </AuthProvider>
  );
}
