const { ethers } = require('ethers');
require('dotenv').config();  // Ensure you load the environment variables

// ABI and Contract Address (Replace with actual ABI and contract address)
const contractABI = require('./ExamRecordsABI.json');  // Replace with actual ABI file path
const contractAddress = '0xYourContractAddress';  // Replace with your deployed contract address

// Connect to Ethereum provider (using Infura or other providers)
const provider = new ethers.providers.InfuraProvider('sepolia', process.env.INFURA_PROJECT_ID);

// Wallet private key of the admin that has the DEFAULT_ADMIN_ROLE
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, adminWallet);

// Define the LECTURER_ROLE as the keccak256 hash of the string "LECTURER_ROLE"
const LECTURER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LECTURER_ROLE"));

async function assignLecturers() {
    try {
        const lecturer1 = '0xd3c6B360bCFc88b29B2974cf6c330b29D8816262';
        const lecturer2 = '0x2b4a96ee8d08fADa41442d74be099e99cf3b4485';

        // Assign Lecturer Role to lecturer1
        let tx = await contract.assignLecturer(lecturer1);
        await tx.wait();
        console.log(`Lecturer role assigned to ${lecturer1}. Transaction hash: ${tx.hash}`);

        // Assign Lecturer Role to lecturer2
        tx = await contract.assignLecturer(lecturer2);
        await tx.wait();
        console.log(`Lecturer role assigned to ${lecturer2}. Transaction hash: ${tx.hash}`);

        // Check if the second lecturer has the LECTURER_ROLE
        const hasRole = await contract.hasRole(LECTURER_ROLE, "0x2B4A96ee8d08fADa41442d74be099E99CF3B4485");

        if (hasRole) {
            console.log("The account 0x2B4A96ee8d08fADa41442d74be099E99CF3B4485 has the LECTURER_ROLE.");
        } else {
            console.log("The account 0x2B4A96ee8d08fADa41442d74be099E99CF3B4485 does NOT have the LECTURER_ROLE.");
        }

    } catch (error) {
        console.error('Error assigning lecturer roles:', error);
    }
}

assignLecturers();

