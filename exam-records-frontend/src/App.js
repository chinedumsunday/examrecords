import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import StudentPage from './components/StudentPage';
import LecturerPage from './components/LecturerPage';
import ValidatorPage from './components/ValidatorPage';
import AboutPage from './components/About';
import ContactPage from './components/ContactPage';
import FeaturesPage from './components/FeaturesPage';
import { BlockchainProvider } from './context/BlockchainContext'; // Import the context provider

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [userRole, setUserRole] = useState(null);

  return (
    <BlockchainProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={<LandingPage setUserRole={setUserRole} setWalletAddress={setWalletAddress} />} 
          />

          {/* Protected Routes */}
          {/* Student Page */}
          {walletAddress && userRole === 'student' ? (
            <Route path="/student" element={<StudentPage walletAddress={walletAddress} setWalletAddress={setWalletAddress} />} />
          ) : (
            <Route path="/student" element={<Navigate to="/" />} />
          )}

          {/* Lecturer Page */}
          {walletAddress && userRole === 'lecturer' ? (
            <Route path="/lecturer" element={<LecturerPage walletAddress={walletAddress} setWalletAddress={setWalletAddress} />} />
          ) : (
            <Route path="/lecturer" element={<Navigate to="/" />} />
          )}

          {/* Validator Page */}
          {walletAddress && userRole === 'validator' ? (
            <Route path="/validator" element={<ValidatorPage walletAddress={walletAddress} setWalletAddress={setWalletAddress} />} />
          ) : (
            <Route path="/validator" element={<Navigate to="/" />} />
          )}

          {/* About */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/features" element={<FeaturesPage />} />
        </Routes>
      </Router>
    </BlockchainProvider>
  );
}

export default App;
