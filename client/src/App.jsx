import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import AdminUpload from './pages/AdminUpload';
import ViewPDF from './pages/ViewPDF';
import Navbar from './components/Navbar';
import UIDemo from './pages/UIDemo';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-[#f8fafc]">
                    <Navbar />
                    <Routes>
                        <Route path="/demo" element={<UIDemo />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-otp" element={<VerifyOtp />} />

                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin-upload" element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminUpload />
                            </ProtectedRoute>
                        } />

                        <Route path="/view-pdf/:id" element={
                            <ProtectedRoute>
                                <ViewPDF />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                    <div className="global-watermark">
                        Built by Ayush Sharma
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
