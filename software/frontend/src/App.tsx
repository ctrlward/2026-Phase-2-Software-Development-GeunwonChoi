import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { BadgesPage } from './pages/BadgesPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, fetchProfile, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-mono">
        <div className="glass-card p-8 text-center max-w-md w-full border border-cyan-500/40">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-cyan-400 font-bold text-sm tracking-wider uppercase">
            VERIFYING SYSTEM OVERSEER CLEARANCE...
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/badges"
            element={
              <ProtectedRoute>
                <Navbar />
                <BadgesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Navbar />
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
                    <AdminPage />
                  </div>
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
