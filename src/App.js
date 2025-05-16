import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UniSharePage from './pages/UnisharePage';
import UniShareUpload from './pages/UnishareUpload'; // Import the UniShareUpload component
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:section" element={<ProfilePage />} />
          
          {/* Document sharing routes - changed to unishare-files to avoid conflicts */}
          <Route path="/unishare-files" element={<UniShareUpload activeSection="home" />} />
          <Route path="/unishare-files/home" element={<UniShareUpload activeSection="home" />} />
          <Route path="/unishare-files/upload" element={<UniShareUpload activeSection="upload" />} />
          <Route path="/unishare-files/my-files" element={<UniShareUpload activeSection="my-files" />} />
          <Route path="/unishare-files/history" element={<UniShareUpload activeSection="history" />} />
          <Route path="/unishare-files/shared" element={<UniShareUpload activeSection="shared" />} />
          <Route path="/unishare-files/trash" element={<UniShareUpload activeSection="trash" />} />
          
          {/* General unishare routes for groups/courses */}
          <Route path="/unishare" element={<UniSharePage />} />
          <Route path="/unishare/:section" element={<UniSharePage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Admin routes with tab parameter */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
