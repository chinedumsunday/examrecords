const { ethers } = require('ethers');
require('dotenv').config();  // Ensure you load the environment variables

// ABI and Contract Address (Replace with actual ABI and contract address)
const contractABI = require('./scripts/abi.json');  // Replace with actual ABI file path
const contractAddress = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf';  // Replace with your deployed contract address

// Connect to Ethereum provider (using Infura or other providers)
const provider = new ethers.providers.InfuraProvider('sepolia', process.env.INFURA_PROJECT_ID);

// Admin private key and wallet
const adminPrivateKey = 'a157ed8a461d569f4a0e603a7f8a0acc8d569ee670934ec95f8d6077fa4b45d4'; 
const wallet = new ethers.Wallet(adminPrivateKey, provider);

// Create a contract instance
const ExamRecords = new ethers.Contract(contractAddress, contractABI, wallet);

// List of addresses you want to assign as validators
const validatorAddresses = [
  '0x041C3Fad0586b87D4D348C8A90Ab39fE3ba4f8A1',
  '0x251171882729E0279Cc54743E1Ad8a3ac7f4aD38'
];

async function assignValidator(validatorAddress) {
  try {
    // Send transaction to assign the validator role
    const tx = await ExamRecords.assignValidator(validatorAddress);
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Validator ${validatorAddress} assigned. Tx hash:`, tx.hash);
  } catch (error) {
    console.error(`Error assigning validator ${validatorAddress}:`, error);
  }
}

// Loop through the list of validator addresses and assign them
async function assignValidators() {
  for (const address of validatorAddresses) {
    await assignValidator(address);
  }
}

// Run the function
assignValidators();
