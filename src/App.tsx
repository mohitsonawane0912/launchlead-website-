import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ContactPage } from './pages/ContactPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Scroll to top automatically on route transitions
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#060a14] selection:bg-blue-600 selection:text-white">
      <ScrollToTop />
      {/* Public Header is rendered for public pages */}
      {!isAdminRoute && <Header />}

      {/* Main Content View */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Owner / Admin Private Routes */}
          <Route path="/admin" element={<Navigate to="/admin/submissions" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Public Footer is rendered for public pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
};

export default App;
