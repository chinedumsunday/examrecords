// const { Contract } = require('ethers');
const { ethers } = require('ethers');
const contractABI = require('./abi.json');  // Make sure your ABI file is located here
const contractAddress = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf';  // Your contract address

// Function to connect to the user's wallet (e.g., MetaMask)
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });  // Request accounts from MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);  // Connect to MetaMask
            const signer = await provider.getSigner();  // Get the user's signer (connected account)
            console.log('Wallet connected:', await signer.getAddress());
            return signer;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw new Error('Wallet connection failed.');
        }
    } else {
        console.error('No Ethereum wallet found. Please install MetaMask.');
        throw new Error('No wallet found.');
    }
}

// Function to upload exam results using the connected wallet
async function uploadResults(courseCode, batchId, ipfsHash) {
    try {
        const signer = await connectWallet();  // Connect the wallet and get the signer
        const contract = new ethers.Contract(contractAddress, contractABI, signer);  // Use the connected wallet as signer

        // Call the smart contract function
        const tx = await contract.uploadExamResults(courseCode, batchId, ipfsHash);
        await tx.wait();  // Wait for the transaction to be confirmed
        console.log(`Results uploaded. Tx Hash: ${tx.hash}`);
    } catch (error) {
        console.error('Error uploading results:', error);
    }
}

// Function to approve results using the connected wallet
async function approveResults(courseCode, batchId) {
    try {
        const signer = await connectWallet();  // Connect the wallet and get the signer
        const contract = new ethers.Contract(contractAddress, contractABI, signer);  // Use the connected wallet as signer

        // Call the smart contract function
        const tx = await contract.approveResults(courseCode, batchId);
        await tx.wait();  // Wait for the transaction to be confirmed
        console.log(`Results approved. Tx Hash: ${tx.hash}`);
    } catch (error) {
        console.error('Error approving results:', error);
    }
}
module.exports = {uploadResults, approveResults};