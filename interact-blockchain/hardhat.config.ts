import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    // for testnet
    'lisk-sepolia-testnet': {
      url: 'https://rpc.sepolia-api.lisk.com',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
    apiKey: {
      "lisk-sepolia-testnet": "KDJJBQ4I7CT5G4F8TID2UWVVCB5P3KTC2C"
    },
    customChains: [ 
      {
        network: "lisk-sepolia-testnet",
        chainId: 4202,
        urls: {
            apiURL: "https://sepolia-blockscout.lisk.com/api",
            browserURL: "https://sepolia-blockscout.lisk.com"
        }
      }
  ]
  },
  sourcify: {
    enabled: false
  },
 
};

export default config;