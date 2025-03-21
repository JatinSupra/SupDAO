/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    supra: {
      url: "https://rpc-evmstaging.supra.com/rpc/v1/eth",
      chainId: 232,
      accounts: [`0x3c6fc035d49d6ea4040019853068366bc16a24961054deb7b5d94d4b017fdb9e`]
    }
  }
};
