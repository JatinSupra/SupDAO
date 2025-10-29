const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const privateKey = hre.network.config.accounts[0];
    const provider = ethers.provider;
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Deploying from:", wallet.address);
    console.log("Chain ID:", hre.network.config.chainId);
    const CrossChainDAO = await ethers.getContractFactory("CrossChainDAO", wallet);
    const deployTx = CrossChainDAO.getDeployTransaction();
    
    const tx = {
        data: deployTx.data,
        chainId: hre.network.config.chainId,
        nonce: await provider.getTransactionCount(wallet.address),
        gasLimit: ethers.BigNumber.from(5000000), // 5M gas
        gasPrice: await provider.getGasPrice(),
        type: 0 // Legacy transaction
    };
    
    console.log("Transaction:", {
        nonce: tx.nonce,
        gasLimit: tx.gasLimit.toString(),
        gasPrice: tx.gasPrice.toString(),
        chainId: tx.chainId
    });
    
    // Sign the transaction
    const signedTx = await wallet.signTransaction(tx);
    
    console.log("\nSending raw transaction...");
    
    // Send raw transaction and get hash from SupraEVM RPC
    const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);
    
    console.log("\nTransaction Hash (from SupraEVM):", txHash);
    
    // Wait for confirmation
    console.log("\nWaiting for confirmation...");
    const receipt = await provider.waitForTransaction(txHash);
    
    console.log("\nDeployed to:", receipt.contractAddress);
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
