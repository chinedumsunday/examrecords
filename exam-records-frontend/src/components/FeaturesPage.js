/// src/components/FeaturesPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      
      {/* Navbar Section */}
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-black bg-opacity-50 z-50">
        <Link to="/" className="text-2xl font-bold hover:underline">
          Exam Records
        </Link>
        <ul className="flex space-x-6">
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/features" className="hover:underline">Features</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </nav>

      {/* Features Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-8">Platform Features</h1>
        <p className="text-lg max-w-4xl mx-auto mb-6 leading-relaxed">
          Exam Records offers a range of features designed to enhance academic data security, accessibility, and efficiency.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Secure Blockchain Storage</h2>
            <p>All exam records are stored on a blockchain, ensuring data integrity and preventing tampering.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Role-Based Access</h2>
            <p>Only students, lecturers, and validators with verified roles can access and interact with the platform.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Real-Time Validation</h2>
            <p>Validators can review and approve records instantly, helping maintain data accuracy across the platform.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Wallet-Based Authentication</h2>
            <p>Connect with a secure wallet, ensuring protected access and full control over personal records.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">User-Friendly Interface</h2>
            <p>An intuitive interface designed to simplify interactions for all users, from students to validators.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Scalability</h2>
            <p>Our platform scales easily, making it suitable for institutions of all sizes.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
