require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_NETWORK,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`]  // Private key from .env file
    }
  }
};
