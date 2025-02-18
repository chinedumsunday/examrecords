// src/components/ContactPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 5000);
  };

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
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-12 text-center mt-20" // Add top margin here
      >
        <h1 className="text-5xl font-bold mb-8">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
          Have questions or feedback? We'd love to hear from you. Fill out the form below, and we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-left font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-left font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label className="block text-left font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white h-32"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-800">
            Send Message
          </button>
          {messageSent && (
            <p className="text-green-400 mt-4">Thank you! Your message has been sent.</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ContactPage;
