import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract} from 'ethers'; // Updated imports
import MyNFTABI from './MyNFTABI.json';

const MyNFTComponent = () => {
  // State variables
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentTokenId, setCurrentTokenId] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [mintStatus, setMintStatus] = useState('');
  const [userNFTs, setUserNFTs] = useState([]);

  // Contract details
  const contractAddress = "0xa1334B9DB5C4A994966b8ca4e19c2E7cDdd0ce5d";

  // Initialize provider and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Updated provider initialization
          const provider = new BrowserProvider(window.ethereum);
          setProvider(provider);
          
          // Get signer
          const signer = await provider.getSigner();
          
          // Get user address
          const address = await signer.getAddress();
          setUserAddress(address);
          setRecipientAddress(address);
          
          // Create contract instance
          const nftContract = new Contract(contractAddress, MyNFTABI, signer);
          setContract(nftContract);
          
          await loadContractData(nftContract, address);
        } catch (error) {
          console.error("Error initializing:", error);
        }
      } else {
        alert("Please install MetaMask to use this dApp!");
      }
    };

    init();
  }, []);

  // Load contract data
  const loadContractData = async (contract, address) => {
    try {
      const tokenId = await contract.currentTokenId();
      setCurrentTokenId(Number(tokenId));
      
      await getUserNFTs(contract, address);
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  };

  // Get user's NFTs
  const getUserNFTs = async (contract, address) => {
    const nfts = [];
    const balance = await contract.balanceOf(address);
    
    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      nfts.push(Number(tokenId));
    }
    
    setUserNFTs(nfts);
  };

  // Mint new NFT
  const mintNFT = async () => {
    if (!contract || !recipientAddress) return;
    
    try {
      setMintStatus('Minting...');
      const tx = await contract.mint(recipientAddress);
      await tx.wait();
      
      setMintStatus('Mint successful!');
      await loadContractData(contract, userAddress);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintStatus(`Mint failed: ${error.message}`);
    }
  };

  return (
    <div className="nft-container">
      <h1>MyNFT Contract Interface</h1>
      
      <div className="contract-info">
        <h2>Contract Info</h2>
        <p>Current Token ID: {currentTokenId}</p>
        <p>Your Address: {userAddress}</p>
      </div>
      
      <div className="mint-section">
        <h2>Mint New NFT</h2>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Recipient address"
        />
        <button onClick={mintNFT}>Buy</button>
        {mintStatus && <p>{mintStatus}</p>}
      </div>
      
      <div className="user-nfts">
        <h2>Your NFTs</h2>
        {userNFTs.length > 0 ? (
          <ul>
            {userNFTs.map((tokenId) => (
              <li key={tokenId}>Token ID: {tokenId}</li>
            ))}
          </ul>
        ) : (
          <p>You don't own any NFTs yet</p>
        )}
      </div>
    </div>
  );
};

export default MyNFTComponent;