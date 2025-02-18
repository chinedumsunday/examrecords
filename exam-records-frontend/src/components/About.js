// src/components/AboutPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => {
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

      {/* Main About Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-12 text-center mt-20" // Add top margin here
      >
        <h1 className="text-5xl font-bold mb-8">About Exam Records</h1>
        <p className="text-lg max-w-4xl mx-auto mb-6 leading-relaxed">
          Exam Records is a secure, decentralized platform for managing and verifying academic results. By leveraging blockchain technology, we ensure that exam records are tamper-proof, transparent, and accessible, offering a streamlined solution for students, lecturers, and validators.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">For Students</h2>
            <p className="text-base">
              Access your exam records anytime, from anywhere. Connect your wallet to view authenticated results and track academic performance effortlessly, ensuring all records are accurate and protected.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">For Lecturers</h2>
            <p className="text-base">
              Easily upload and manage students' results on a trusted platform. Reduce paperwork and increase efficiency, knowing each entry is securely stored and accessible only to authorized individuals.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">For Validators</h2>
            <p className="text-base">
              Verify and approve exam results through an immutable system. This role ensures the accuracy and credibility of academic records, protecting the integrity of each student’s achievements.
            </p>
          </div>
        </div>

        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to empower educational institutions by providing a secure and transparent method of managing and validating academic records. We believe in a future where students and educators can rely on technology to safeguard their achievements, promote transparency, and enhance trust.
          </p>
        </section>

        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Key Features</h2>
          <ul className="text-lg space-y-4 list-disc list-inside">
            <li>Blockchain-based record storage for transparency and security.</li>
            <li>User-friendly interfaces for students, lecturers, and validators.</li>
            <li>Real-time validation to confirm the authenticity of records.</li>
            <li>Wallet connection for secure access and data protection.</li>
            <li>Scalable design to accommodate various educational institutions.</li>
          </ul>
        </section>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-4">Want to Learn More?</h3>
          <p>
            Reach out to us or explore our platform further to see how Exam Records is redefining the way academic results are managed and verified.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
