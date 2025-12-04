// React Frontend - Main App Component
// File: src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import SubmitText from './components/Grievance/SubmitText';
import SubmitPDF from './components/Grievance/SubmitPDF';
import GrievanceList from './components/Grievance/GrievanceList';
import AdminDashboard from './components/Admin/AdminDashboard';
import Navbar from './components/Layout/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <AppContent />
                </div>
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    return (
        <>
            {user && <Navbar />}
            
            <Routes>
                <Route path="/login" element={
                    user ? <Navigate to="/dashboard" /> : <Login />
                } />
                
                <Route path="/register" element={
                    user ? <Navigate to="/dashboard" /> : <Register />
                } />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/submit-text" element={
                    <ProtectedRoute>
                        <SubmitText />
                    </ProtectedRoute>
                } />
                
                <Route path="/submit-pdf" element={
                    <ProtectedRoute>
                        <SubmitPDF />
                    </ProtectedRoute>
                } />
                
                <Route path="/grievances" element={
                    <ProtectedRoute>
                        <GrievanceList />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </>
    );
}

function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
}

export default App;
