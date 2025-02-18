const { ethers } = require('ethers');
require('dotenv').config();  // Ensure you load the environment variables

// ABI and Contract Address (Replace with actual ABI and contract address)
const contractABI = require('./scripts/abi.json');  // Replace with actual ABI file path
const contractAddress = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf';  // Replace with your deployed contract address

// Connect to Ethereum provider (using Infura or other providers)
const provider = new ethers.providers.InfuraProvider('sepolia', process.env.INFURA_PROJECT_ID);

// Verify that the private key is being loaded
console.log("Private Key:", 'a157ed8a461d569f4a0e603a7f8a0acc8d569ee670934ec95f8d6077fa4b45d4');  // Debugging

// Create wallet instance with the admin private key
const adminWallet = new ethers.Wallet('a157ed8a461d569f4a0e603a7f8a0acc8d569ee670934ec95f8d6077fa4b45d4', provider);

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, adminWallet);

const LECTURER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LECTURER_ROLE"));


// Function to validate Ethereum address
function isValidAddress(address) {
    return ethers.utils.isAddress(address);
}

async function assignLecturers() {
    try {
        const lecturer1 = '0xd3c6B360bCFc88b29B2974cf6c330b29D8816262';
        const lecturer2 = '0x2b4a96ee8d08fada41442d74be099e99cf3b4485';

        // Validate addresses
        if (!isValidAddress(lecturer1)) {
            throw new Error(`Invalid Ethereum address: ${lecturer1}`);
        }
        if (!isValidAddress(lecturer2)) {
            throw new Error(`Invalid Ethereum address: ${lecturer2}`);
        }

        // Assign Lecturer Role to lecturer1
        let tx = await contract.assignLecturer(lecturer1);
        await tx.wait();
        console.log(`Lecturer role assigned to ${lecturer1}. Transaction hash: ${tx.hash}`);

        // Assign Lecturer Role to lecturer2
        tx = await contract.assignLecturer(lecturer2);
        await tx.wait();
        console.log(`Lecturer role assigned to ${lecturer2}. Transaction hash: ${tx.hash}`);

    } catch (error) {
        console.error('Error assigning lecturer roles:', error);
    }
    
    const hasRole = await contract.hasRole(LECTURER_ROLE, "0x2B4A96ee8d08fADa41442d74be099E99CF3B4485");

    if (!hasRole) {
    console.error("The account is missing the LECTURER_ROLE.");
    } else {
    console.log("The account has the correct role.");
    }
}

assignLecturers();
