// src/components/StudentPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';
import api from '../api';
import ParticleBackground from './ParticleBackground';

const StudentPage = ({ walletAddress, setWalletAddress }) => {
  const [results, setResults] = useState({});
  const [studentName, setStudentName] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await api.get(`/students/${walletAddress}/results`);
        
        if (response.data && response.data.student_name && response.data.groupedResults) {
          setResults(response.data.groupedResults);
          setStudentName(response.data.student_name);
        } else {
          setErrorMessage('Unexpected response format from server.');
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        setErrorMessage('Error fetching results. Please try again later.');
        console.error('Error fetching results:', error);
      }
    }

    if (walletAddress) {
      fetchResults();
    }
  }, [walletAddress]);

  const printResults = () => {
    const printWindow = window.open('', '_blank');
    const batchResults = results[selectedBatch];
    
    if (printWindow && batchResults) {
      printWindow.document.write('<html><head><title>Batch Results</title></head><body>');
      printWindow.document.write(`<h2>Results for Batch ${selectedBatch}</h2>`);
      printWindow.document.write('<table border="1" style="width: 100%; text-align: left;"><thead><tr>');
      printWindow.document.write('<th>Course Code</th><th>Course Name</th><th>Score</th><th>CA Score</th><th>Grade</th></tr></thead><tbody>');
      batchResults.forEach(result => {
        printWindow.document.write(
          `<tr><td>${result.course_code}</td><td>${result.course_name}</td><td>${result.score}</td><td>${result.ca_score}</td><td>${result.grade}</td></tr>`
        );
      });
      printWindow.document.write('</tbody></table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target.id === 'modalOverlay') {
      setSelectedBatch(null);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null); // Clear the wallet address
    navigate('/'); // Redirect to the landing page
  };

  return (
    <div className="relative container mx-auto mt-10 px-4">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Wallet address and disconnect options */}
      <div className="absolute top-5 right-5 z-20">
        <div
          className="p-2 bg-gray-800 text-white rounded-lg cursor-pointer"
          onClick={() => setShowWalletOptions(!showWalletOptions)}
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          <FaCopy
            className="inline ml-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(walletAddress || '');
              alert('Wallet Address Copied!');
            }}
          />
        </div>

        {showWalletOptions && walletAddress && (
          <div className="absolute bg-gray-700 text-white p-2 rounded-lg mt-2 z-30">
            <div
              className="cursor-pointer hover:bg-gray-600 p-2"
              onClick={handleDisconnect} // Call handleDisconnect on click
            >
              Disconnect
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 text-white">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Student Dashboard</h2>
          <p><strong>Student Name:</strong> {studentName}</p>
          <p><strong>Wallet Address:</strong> {walletAddress}</p>
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {Object.keys(results).length === 0 ? (
          <p>No results found for this student.</p>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Your Batches</h3>
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600">Batch ID</th>
                  <th className="py-2 px-4 border-b border-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(results).map(batchId => (
                  <tr key={batchId} className="border-b border-gray-600">
                    <td className="py-2 px-4 text-center">{batchId}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-800 transition-all"
                        onClick={() => setSelectedBatch(batchId)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedBatch && (
          <div
            id="modalOverlay"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50"
            onClick={handleOverlayClick}
          >
            <div className="bg-gray-800 text-white w-11/12 sm:w-3/4 lg:w-1/2 max-h-[80vh] rounded-lg overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">Results for Batch {selectedBatch}</h2>
              <table className="min-w-full mb-6">
                <thead>
                  <tr>
                    <th className="border py-2 px-4">Course Code</th>
                    <th className="border py-2 px-4">Course Name</th>
                    <th className="border py-2 px-4">Score</th>
                    <th className="border py-2 px-4">CA Score</th>
                    <th className="border py-2 px-4">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results[selectedBatch].map((result, index) => (
                    <tr key={index}>
                      <td className="border py-2 px-4">{result.course_code}</td>
                      <td className="border py-2 px-4">{result.course_name}</td>
                      <td className="border py-2 px-4">{result.score}</td>
                      <td className="border py-2 px-4">{result.ca_score}</td>
                      <td className="border py-2 px-4">{result.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-800 transition-all mr-4"
                onClick={printResults}
              >
                Print Results
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-800 transition-all"
                onClick={() => setSelectedBatch(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StudentPage);
