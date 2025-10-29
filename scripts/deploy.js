const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    let wallet;
    const provider = ethers.provider;
    const accounts = hre.network.config.accounts;

    if (accounts.mnemonic) {
        const hdNode = ethers.utils.HDNode.fromMnemonic(accounts.mnemonic);
        const derivedNode = hdNode.derivePath(accounts.path + "/0");
        wallet = new ethers.Wallet(derivedNode.privateKey, provider);
    } else if (Array.isArray(accounts)) {
        wallet = new ethers.Wallet(accounts[0], provider);
    } else {
        throw new Error("Unable to get private key from config");
    }
    
    console.log("Deploying from:", wallet.address);
    const CrossChainDAO = await ethers.getContractFactory("CrossChainDAO");
    const deployTx = await CrossChainDAO.getDeployTransaction();
        const tx = {
        from: wallet.address,
        data: deployTx.data,
        gasLimit: await provider.estimateGas({
            from: wallet.address,
            data: deployTx.data
        }),
        gasPrice: await provider.getGasPrice(),
        nonce: await provider.getTransactionCount(wallet.address),
        chainId: (await provider.getNetwork()).chainId
    };
    const signedTx = await wallet.signTransaction(tx);
    const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);
    console.log("Transaction hash (from RPC):", txHash);
    const receipt = await provider.waitForTransaction(txHash);
    console.log("DAO deployed to:", receipt.contractAddress);
    console.log("Block number:", receipt.blockNumber);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
