// src/components/LandingPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { connectWallet, getUserRole } from '../web3';


const LandingPage = ({ setUserRole, setWalletAddress }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleStudentRole = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);

      const role = await getUserRole(address, 'student');
      setUserRole(role);

      if (role === 'student') {
        navigate('/student');
      } else {
        setErrorMessage('Student role not found for this wallet.');
      }
    } catch (error) {
      setErrorMessage(`Error in handleStudentRole: ${error.message}`);
    }
  };

  const handleLecturerRole = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);

      const role = await getUserRole(address, 'lecturer');
      setUserRole(role);

      if (role === 'lecturer') {
        navigate('/lecturer');
      } else if (role === 'validator') {
        navigate('/validator');
      } else {
        setErrorMessage('Lecturer or validator role not found for this wallet.');
      }
    } catch (error) {
      setErrorMessage(`Error in handleLecturerRole: ${error.message}`);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Main content container with flexbox for centering */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center text-center px-4">
        {/* Navbar Section */}
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-black bg-opacity-50">
          <div className="text-2xl font-bold">Exam Records</div>
          <ul className="flex space-x-6">
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/features" className="hover:underline">Features</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold mb-6">Welcome to Exam Records</h1>
          <p className="text-xl mb-4">Select your role to continue</p>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleStudentRole}
              className="px-6 py-2 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-800 transition-all"
            >
              Student Login
            </button>
            <button
              onClick={handleLecturerRole}
              className="px-6 py-2 bg-green-600 text-white text-xl rounded-lg hover:bg-green-800 transition-all"
            >
              Lecturer Login
            </button>
          </div>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </motion.div>

        {/* Footer Section */}
        <footer className="absolute bottom-0 w-full py-6 bg-black bg-opacity-50 text-center text-gray-400">
          <p>&copy; 2024 Exam Records. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default React.memo(LandingPage);
