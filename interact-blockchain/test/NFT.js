const { expect } = require("chai");

describe("NFT", function () {
  let nftToken;

  beforeEach(async () => {
    // Deploy contract
    const NFT = await ethers.getContractFactory("NFT");
    nftToken = await NFT.deploy();
  });

  it("Should allow to mint a new NFT", async function () {
    const [owner] = await ethers.getSigners();
    // Before minting the NFT, the account balance for this NFT should be zero.
    expect(await nftToken.balanceOf(owner.address)).to.equal(0);
    // Mint the NFT
    await nftToken.mint(owner.address);
    // After minting the NFT, the account balance for this NFT should be 1 for the account that minted the token.
    expect(await nftToken.balanceOf(owner.address)).to.equal(1);
  });
});