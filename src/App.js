import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UniSharePage from './pages/UnisharePage';
import UniShareUpload from './pages/UnishareUpload';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from './services';
import { isAdmin, isModerator } from './utils/roleUtils';

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!authService.isLoggedIn()) {
          navigate('/login');
          return;
        }

        const userData = await authService.getCurrentUser();
        setUser(userData);

        if (!isAdmin(userData) && !isModerator(userData)) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking user permissions:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return isAdmin(user) || isModerator(user) ? children : null;
};

// Protected route for authenticated users
const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(authService.isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  return authenticated ? children : null;
};

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/profile/:section" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Document sharing routes */}
          <Route path="/unishare-files" element={<UniShareUpload activeSection="home" />} />
          <Route path="/unishare-files/home" element={<UniShareUpload activeSection="home" />} />
          <Route path="/unishare-files/upload" element={
            <ProtectedRoute>
              <UniShareUpload activeSection="upload" />
            </ProtectedRoute>
          } />
          <Route path="/unishare-files/my-files" element={
            <ProtectedRoute>
              <UniShareUpload activeSection="my-files" />
            </ProtectedRoute>
          } />
          <Route path="/unishare-files/history" element={
            <ProtectedRoute>
              <UniShareUpload activeSection="history" />
            </ProtectedRoute>
          } />
          <Route path="/unishare-files/shared" element={
            <ProtectedRoute>
              <UniShareUpload activeSection="shared" />
            </ProtectedRoute>
          } />
          <Route path="/unishare-files/trash" element={
            <ProtectedRoute>
              <UniShareUpload activeSection="trash" />
            </ProtectedRoute>
          } />
          
          {/* General unishare routes for groups/courses */}
          <Route path="/unishare" element={<UniSharePage />} />
          <Route path="/unishare/:section" element={<UniSharePage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Admin routes with protected access */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          <Route path="/admin/:tab" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
