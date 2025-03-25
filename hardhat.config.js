/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    supra: {
      url: " ",
      chainId: 119,
      accounts: [`0xYOUR_STARKEY_PRIVATE_KEY`]
    }
  }
};