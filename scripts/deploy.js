const { ethers } = require("hardhat");

async function main() {
    const CrossChainDAO = await ethers.getContractFactory("CrossChainDAO");
    const dao = await CrossChainDAO.deploy();
    await dao.deployed();
    console.log("DAO deployed to:", dao.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
