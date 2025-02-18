import React, { useState, useEffect } from 'react';
import api from '../api';
import { useBlockchain } from '../context/BlockchainContext';
import ParticleBackground from './ParticleBackground';
import { FaCopy } from 'react-icons/fa'; // Copy Icon
import { useNavigate } from 'react-router-dom'; // For navigation

const ValidatorPage = () => {
    const { walletAddress, contract, setWalletAddress } = useBlockchain();
    const [lecturers, setLecturers] = useState([]);
    const [exams, setExams] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [showResultsPopup, setShowResultsPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingApprove, setPendingApprove] = useState({});
    const [note, setNote] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const response = await api.get('/validators/lecturers');
            setLecturers(response.data.lecturers);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const fetchExams = async (walletAddress) => {
        try {
            const response = await api.get(`/validators/lecturers/${walletAddress}/exams`);
            setExams(response.data.exams);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    const fetchExamResults = async (examId) => {
        try {
            const response = await api.get(`/validators/exams/${examId}/results`);
            setExamResults(response.data.results);
            setSelectedExam(examId);
            setShowResultsPopup(true);
        } catch (error) {
            console.error('Error fetching exam results:', error);
        }
    };

    const handleApproveClick = (courseCode, batchId) => {
        setPendingApprove({ courseCode, batchId });
        setShowConfirmation(true);
    };

    const approveExam = async () => {
        const { courseCode, batchId } = pendingApprove;
        try {
            const tx = await contract.approveResults(courseCode, batchId);
            await tx.wait();
            setStatusMessage('✅ Exam approved successfully!');
            setShowConfirmation(false);
            fetchExams();
        } catch (error) {
            console.error('Error approving exam:', error);
            setStatusMessage('❌ Failed to approve exam.');
        }
    };

    const handleDisconnect = () => {
        setWalletAddress(null);
        navigate('/');
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-white">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Foreground Content */}
            <div className="relative z-10 container mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-100">🎓 Validator Dashboard</h2>
                    <div className="bg-gray-800 p-3 rounded-lg">
                        {walletAddress && (
                            <div className="text-sm">
                                Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}{' '}
                                <FaCopy
                                    className="inline cursor-pointer ml-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(walletAddress);
                                        alert('Wallet Address Copied!');
                                    }}
                                />
                                <button
                                    className="ml-4 text-red-400 hover:text-red-600 font-semibold"
                                    onClick={handleDisconnect}
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lecturer Section */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4 text-blue-300">Select a Lecturer</h3>
                    <ul>
                        {lecturers.map((lecturer) => (
                            <li
                                key={lecturer.wallet_address}
                                className="flex justify-between items-center p-3 mb-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                            >
                                <div>
                                    <span className="font-medium">{lecturer.name}</span> <br />
                                    <span className="text-sm text-gray-400">
                                        {lecturer.wallet_address}
                                    </span>
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                                    onClick={() => fetchExams(lecturer.wallet_address)}
                                >
                                    View Exams
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Exams Section */}
                {exams.length > 0 && (
                    <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-semibold mb-4 text-green-300">Pending Exams</h3>
                        <div className="overflow-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="p-3">Course Name</th>
                                        <th className="p-3">Batch ID</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((exam) => (
                                        <tr key={exam.exam_id} className="hover:bg-gray-700 transition">
                                            <td className="p-3">{exam.course_name}</td>
                                            <td className="p-3">{exam.batch_id}</td>
                                            <td className="p-3 space-y-2 md:space-y-0 md:space-x-3">
                                                {exam.status !== 'Approved' && (
                                                    <button
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                                        onClick={() =>
                                                            handleApproveClick(
                                                                exam.course_name,
                                                                exam.batch_id
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                                                    onClick={() => fetchExamResults(exam.exam_id)}
                                                >
                                                    View Results
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Results Popup */}
                {showResultsPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-4 text-yellow-300">
                                Results for Exam ID: {selectedExam}
                            </h3>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="p-2">Course Code</th>
                                        <th className="p-2">Student Name</th>
                                        <th className="p-2">Score</th>
                                        <th className="p-2">CA Score</th>
                                        <th className="p-2">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examResults.map((result, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-700 transition border-b border-gray-700"
                                        >
                                            <td className="p-2">{result.course_code}</td>
                                            <td className="p-2">{result.student_name}</td>
                                            <td className="p-2">{result.score}</td>
                                            <td className="p-2">{result.ca_score}</td>
                                            <td className="p-2">{result.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <textarea
                                className="w-full mt-4 p-2 rounded bg-gray-700 text-white"
                                rows="3"
                                placeholder="Leave a note for the lecturer..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            ></textarea>

                            <div className="text-right mt-4">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded shadow"
                                    onClick={() => setShowResultsPopup(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Dialog */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg text-center">
                            <h3 className="text-2xl font-bold mb-4 text-green-300">
                                Confirm Approval
                            </h3>
                            <p className="mb-4">Are you sure you want to approve this exam?</p>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-3"
                                onClick={approveExam}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {statusMessage && (
                    <div className="mt-4 p-3 bg-yellow-400 text-gray-800 rounded-lg">
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidatorPage;
