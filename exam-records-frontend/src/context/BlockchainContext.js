import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import ExamRecordsABI from '../abi.json'; // Your contract ABI

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [contract, setContract] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    const CONTRACT_ADDRESS = '0x05c1A8d56a7f01aC199743492b8d4Fa35dAB5DAf'; // Replace with deployed address

    // Connect wallet and initialize the contract
    const connectWallet = async () => {
        if (!window.ethereum) {
            setStatusMessage('Please install MetaMask or another Ethereum wallet.');
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setWalletAddress(address);

            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ExamRecordsABI, signer);
            setContract(contractInstance);

            setStatusMessage('Wallet connected and contract initialized successfully.');
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setStatusMessage('Failed to connect wallet.');
        }
    };

    useEffect(() => {
        if (window.ethereum && !walletAddress) {
            connectWallet();
        }
    }, []);

    return (
        <BlockchainContext.Provider
            value={{
                walletAddress,
                setWalletAddress, // Expose setWalletAddress here
                contract,
                connectWallet,
                statusMessage,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};
