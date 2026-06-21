import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MockInterviewGateway from './pages/MockInterviewGateway';
import TechnicalInterview from './pages/TechnicalInterview';
import HRInterview from './pages/HRInterview';
import CodingPractice from './pages/CodingPractice';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AptitudeTests from './pages/AptitudeTests';
import ContestAndHacks from './pages/ContestAndHacks';

// Simple Route guard helper to protect dashboards
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
        <div>
          {/* Global responsive brand header */}
          <Navbar />
          
          {/* Main platform workspace */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected dashboard practice modules */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <MockInterviewGateway />
                </ProtectedRoute>
              }
            />
            <Route
              path="/technical"
              element={
                <ProtectedRoute>
                  <TechnicalInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr"
              element={
                <ProtectedRoute>
                  <HRInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding"
              element={
                <ProtectedRoute>
                  <CodingPractice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aptitude"
              element={
                <ProtectedRoute>
                  <AptitudeTests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contests"
              element={
                <ProtectedRoute>
                  <ContestAndHacks />
                </ProtectedRoute>
              }
            />

            {/* Error Redirection Guard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Universal branding footer in dark styles */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500 font-sans font-normal">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 InterviewAce Platform. Under AI-driven industry training constraints.</p>
            <div className="flex gap-4">
              <a href="/" className="hover:text-slate-350 transition-colors">Privacy policy</a>
              <a href="/" className="hover:text-slate-350 transition-colors">Terms of service</a>
              <a href="/api/health" target="_blank" rel="noreferrer" className="hover:text-[#f97316] transition-colors">Server status</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
