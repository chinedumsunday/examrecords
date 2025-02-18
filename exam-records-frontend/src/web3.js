import { Contract } from 'ethers';
import { ethers } from 'ethers';
import contractABI from './abi.json';  // Make sure your ABI file is located here
const contractAddress = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf';  // Replace with your contract address

let provider;
let signer;
let contract;

// Connect to the user's wallet
export const connectWallet = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    contract = new Contract(contractAddress, contractABI, signer);
    const address = await signer.getAddress();
    
    // Log the wallet address after connection
    console.log(`Connected wallet address: ${address}`);
    
    return address;
  } else {
    throw new Error('No wallet detected');
  }
};

// Fetch the role based on roleType (lecturer/validator from contract, student from backend)
export const getUserRole = async (address, roleType) => {
  try {
    console.log(`Checking ${roleType} role for address: ${address}`);

    if (roleType === 'lecturer') {
      // Step 1: Check the contract for lecturer and validator roles
      console.log('Checking contract roles (lecturer/validator)');

      const LECTURER_ROLE = await contract.LECTURER_ROLE();
      const VALIDATOR_ROLE = await contract.VALIDATOR_ROLE();

      // Check if the wallet address has lecturer role
      if (await contract.hasRole(LECTURER_ROLE, address)) {
        console.log(`Role found in contract: lecturer`);
        return 'lecturer';
      }

      // Check if the wallet address has validator role
      if (await contract.hasRole(VALIDATOR_ROLE, address)) {
        console.log(`Role found in contract: validator`);
        return 'validator';
      }

      console.log('No lecturer or validator role found.');
      return 'unknown';
    } 
    
    if (roleType === 'student') {
      // Backend-based student role check
      console.log('Checking backend for student role');

      // Perform fetch request to backend
      const response = await fetch(`http://localhost:3000/students/${address}/role`);
      console.log(`Received response status: ${response.status}`);

      if (!response.ok) {
        console.error(`Error fetching student role: ${response.statusText}`);
        return 'unknown';
      }

      // Parse response JSON
      const data = await response.json();
      console.log(`Backend role data: ${JSON.stringify(data)}`);

      if (data.role === 'student') {
        console.log('Role found in PostgreSQL: student');
        return 'student';
      } else {
        console.log('No student role found in PostgreSQL.');
        return 'unknown';
      }
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'unknown';
  }
};