import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
import api from '../api';
import * as XLSX from 'xlsx'; 
import ParticleBackground from './ParticleBackground';
import { FaCopy, FaEnvelope } from 'react-icons/fa';

const contractABI = require('../abi.json');
const contractAddress = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf';

const LecturerPage = ({ walletAddress, setWalletAddress }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseCode: '',
    examScore: '',
    caScore: '',
    remarks: '',
    batchId: '',
    lecturerWalletAddress: walletAddress,
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingExams, setPendingExams] = useState([]);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [unreadNotes, setUnreadNotes] = useState([]);
  const [showNotesPopup, setShowNotesPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadNotes = async () => {
      try {
        const response = await api.get('/lecturers/notes', { params: { walletAddress } });
        if (response.data && response.data.notes) {
          setUnreadNotes(response.data.notes);
          setShowNotesPopup(true);
          setTimeout(() => setShowNotesPopup(false), 10000);
        }
      } catch (error) {
        console.error('Error fetching unread notes:', error);
      }
    };

    if (walletAddress) {
      fetchUnreadNotes();
    }
  }, [walletAddress]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      if (parsedData.length > 0) {
        const firstRow = parsedData[0];
        setFormData({
          ...formData,
          studentId: firstRow.studentId || '',
          courseCode: firstRow.courseCode || '',
          examScore: firstRow.examScore || '',
          caScore: firstRow.caScore || '',
          remarks: firstRow.remarks || '',
          batchId: firstRow.batchId || '',
        });
        console.log('Parsed Data:', parsedData);
      }
    };
    reader.readAsBinaryString(file);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address); 
        return signer;
      } catch (error) {
        console.error('Wallet connection failed:', error);
        throw new Error('Wallet connection failed.');
      }
    } else {
      console.error('No Ethereum wallet found. Please install MetaMask.');
      throw new Error('No Ethereum wallet found.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/lecturers/upload', {
        ...formData,
        lecturerWalletAddress: walletAddress,
      });

      const ipfsHash = response.data.ipfsHash;
      const signer = await connectWallet();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.uploadExamResults(
        formData.courseCode,
        formData.batchId,
        ipfsHash
      );
      await tx.wait();
      setStatusMessage(`Results uploaded to blockchain. Tx Hash: ${tx.hash}`);
    } catch (error) {
      setStatusMessage('Failed to upload results.');
      console.error('Error uploading results:', error);
    }
  };

  useEffect(() => {
    const fetchPendingExams = async () => {
      try {
        const response = await api.get('/lecturers/pending-exams', {
          params: { walletAddress },
        });

        if (response.data && response.data.exams) {
          setPendingExams(response.data.exams);
        }
      } catch (error) {
        console.error('Error fetching pending exams:', error);
      }
    };

    if (walletAddress) {
      fetchPendingExams();
    }
  }, [walletAddress]);

  const handleDisconnect = () => {
    if (setWalletAddress) {
      setWalletAddress(null);
      navigate('/');
    } else {
      console.error('setWalletAddress function is not defined');
    }
  };

  // Function to format countdown time
  const formatCountdownTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(); // Formats as MM/DD/YYYY by default
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      <div className="absolute top-5 right-5 z-20 flex items-center space-x-4">
    {/* Message Icon - Clickable */}
    {unreadNotes.length > 0 && (
        <FaEnvelope
            className="text-white text-2xl cursor-pointer hover:text-yellow-500"
            onClick={() => setShowNotesPopup(!showNotesPopup)}  // Toggle popup on click
        />
    )}

    {/* Wallet Address and Disconnect Button */}
    <div className="relative">
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

        {/* Disconnect Option */}
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
</div>

{showNotesPopup && unreadNotes.length > 0 && (
    <div className="fixed top-20 right-5 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <h3 className="font-bold text-lg mb-2">New Messages from Validator:</h3>
        <ul className="space-y-4 max-h-80 overflow-y-auto">
            {unreadNotes.map((note, index) => (
                <li key={index} className="p-3 bg-gray-700 rounded-lg">
                    <p className="font-bold mb-1">{new Date(note.created_at).toLocaleString()}</p>
                    <p>{note.note}</p>
                </li>
            ))}
        </ul>
        <button
            className="mt-3 text-blue-400 underline"
            onClick={() => setShowNotesPopup(false)}
        >
            Close
        </button>
    </div>
)}


      <motion.div
        className="container mx-auto mt-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold text-white mb-6">
          Lecturer - Upload Exam Results
        </h2>

        <form className="bg-gray-900 p-8 rounded-lg shadow-xl space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-white text-xl">Upload CSV/Excel</label>
            <input
              type="file"
              className="w-full p-3 text-white bg-gray-700 rounded-lg"
              onChange={handleFileUpload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white">Student ID</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded-lg"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-white">Course Code</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 text-white rounded-lg"
                placeholder="Course Code"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white">Exam Score</label>
              <input
                type="number"
                className="w-full p-3 bg-gray-800 text-white rounded-lg"
                placeholder="Exam Score"
                value={formData.examScore}
                onChange={(e) => setFormData({ ...formData, examScore: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-white">CA Score</label>
              <input
                type="number"
                className="w-full p-3 bg-gray-800 text-white rounded-lg"
                placeholder="CA Score"
                value={formData.caScore}
                onChange={(e) => setFormData({ ...formData, caScore: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-white">Remarks</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-white">Batch ID</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Batch ID"
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-800 transition-all">
            Upload Results
          </button>
        </form>

        {pendingExams.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl text-white font-bold mb-4">Pending Exams</h3>
            <table className="w-full text-white bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="p-3">Exam ID</th>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">Countdown Time</th>
                  <th className="p-3">Lecturer Address</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingExams.map((exam, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-3"><center>{exam.examid}</center></td>
                    <td className="p-3"><center>{exam.coursecode}</center></td>
                    <td className="p-3"><center>{exam.batchid}</center></td>
                    <td className="p-3"><center>{formatCountdownTime(exam.countdowntime)}</center></td>
                    <td className="p-3"><center>{exam.lecturerwalletaddress}</center></td>
                    <td className="p-3"><center>{exam.validationstatus}</center></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {statusMessage && (
          <p className="mt-6 text-xl text-white font-semibold">{statusMessage}</p>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(LecturerPage);
