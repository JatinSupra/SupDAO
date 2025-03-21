const { ethers } = require("hardhat");

async function main() {
    const daoAddress = "0xb2BAd8AedB997905bAe2406256B077e7c3f68469"; // Replace with your DAO contract address
    const abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
              }
            ],
            "name": "ProposalCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "ProposalExecuted",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "voter",
                "type": "address"
              }
            ],
            "name": "VoteCasted",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_member",
                "type": "address"
              }
            ],
            "name": "addMember",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_description",
                "type": "string"
              }
            ],
            "name": "createProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              }
            ],
            "name": "executeProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "members",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "proposalCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "proposals",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ];
    const signer = await ethers.getSigner();
    const daoContract = new ethers.Contract(daoAddress, abi, signer);

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    async function menu() {
        console.log("\nWelcome to the DAO Interaction Script!");
        console.log("Choose an action:");
        console.log("1. Add a DAO Member");
        console.log("2. Create a Proposal");
        console.log("3. Vote on a Proposal");
        console.log("4. Execute a Proposal");
        console.log("5. Exit");

        readline.question("Enter the number of the action: ", async (action) => {
            try {
                if (action === "1") {
                    readline.question("Enter the member's address: ", async (address) => {
                        const tx = await daoContract.addMember(address);
                        await tx.wait();
                        console.log(`Address ${address} added as a DAO member!`);
                        await menu(); // Loop back to menu
                    });
                } else if (action === "2") {
                    readline.question("Enter the proposal description: ", async (description) => {
                        const tx = await daoContract.createProposal(description);
                        await tx.wait();
                        console.log("Proposal created successfully!");
                        await menu(); // Loop back to menu
                    });
                } else if (action === "3") {
                    readline.question("Enter the proposal ID to vote on: ", async (proposalId) => {
                        const tx = await daoContract.vote(proposalId);
                        await tx.wait();
                        console.log(`Vote cast for proposal ID ${proposalId}!`);
                        await menu(); // Loop back to menu
                    });
                } else if (action === "4") {
                    readline.question("Enter the proposal ID to execute: ", async (proposalId) => {
                        const tx = await daoContract.executeProposal(proposalId);
                        await tx.wait();
                        console.log(`Proposal ID ${proposalId} executed successfully!`);
                        await menu(); // Loop back to menu
                    });
                } else if (action === "5") {
                    console.log("Exiting. Goodbye!");
                    readline.close();
                } else {
                    console.log("Invalid action. Please try again.");
                    await menu(); // Loop back to menu
                }
            } catch (error) {
                console.error("An error occurred:", error.message);
                await menu(); // Loop back to menu
            }
        });
    }

    await menu(); // Start the menu loop
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
