# **DAO Platform on SupraEVM**
This repository showcases the creation and interaction of a DAO Platform deployed on SupraEVM.

This DAO Platform uses SupraEVM as the network to:
1. Deploy smart contracts.
2. Manage transactions and proposal executions within the DAO ecosystem.

## **Getting Started**
Follow these steps to set up and interact with the DAO:

### **Deployment**
1. Clone this repository:

   ```bash
   git clone https://github.com/JatinSupra/SupDAO.git
   cd SupDAO
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Compile the contract:

   ```bash
   npx hardhat compile
   ```
4. Deploy the contract to SupraEVM:

   ```bash
   npx hardhat run scripts/deploy.js --network supra
   ```

### **Interacting with the Contract**
Use the interactive script `interact.js` to perform all DAO functionalities without a frontend.

#### **Commands**
1. **Run the script**:

   ```bash
   npx hardhat run scripts/interact.js --network supra
   ```
2. **Actions Breakdown**:
   - **Add a Member**:
     Enter option `1` and provide the member's Ethereum address.
     Example:

     ```plaintext
     Enter the member's address: YOUR_ADDRESS
     Address successfully added as a DAO member!
     ```
   - **Create a Proposal**:
     Enter option `2` and provide a description for your proposal.
     Example:
     ```plaintext
     Enter the proposal description: "Bring Season 7 of Silicon Valley"
     Proposal created successfully!
     ```
   - **Vote on a Proposal**:
     Enter option `3` and provide the proposal ID to cast your vote.
     Example:
     ```plaintext
     Enter the proposal ID to vote on: 1
     Vote successfully cast!
     ```
   - **Execute a Proposal**:
     Enter option `4` and provide the proposal ID to execute it.
     Example:
     ```plaintext
     Enter the proposal ID to execute: 1
     Proposal executed successfully!
     ```
   - **Exit**:
     Enter option `5` to exit the script.

### **Key Elements of the DAO Smart Contract**

1. **State Variables**
   These are used to store essential data for the DAO, including:
   - **Members**: A mapping to track addresses that are members of the DAO.

     ```solidity
     mapping(address => bool) public members;
     ```
   - **Proposals**: A struct to store information about each proposal and an array to track all proposals.

     ```solidity
     struct Proposal {
         string description;
         uint256 votes;
         bool executed;
     }
     Proposal[] public proposals;
     ```
   - **Owner**: To identify the contract deployer as the DAO administrator.

     ```solidity
     address public owner;
     ```

2. **Modifiers**
   These are functions used to restrict access to specific contract functions:
   - **onlyOwner**: Ensures only the owner can perform an action.

     ```solidity
     modifier onlyOwner() {
         require(msg.sender == owner, "Only the owner can perform this action");
         _;
     }
     ```
   - **onlyMember**: Ensures only DAO members can access certain functionalities.

     ```solidity
     modifier onlyMember() {
         require(members[msg.sender], "Only DAO members can perform this action");
         _;
     }
     ```

3. **Constructor**
   The constructor initializes the contract with the deployer as the owner.

   ```solidity
   constructor() {
       owner = msg.sender;
   }
   ```

4. **Functions**
   These are the actionable parts of the contract that define its behavior:

   - **Add a Member**:
     Allows the owner to add new members to the DAO.

     ```solidity
     function addMember(address _member) public onlyOwner {
         members[_member] = true;
     }
     ```
   - **Create a Proposal**:
     Members can propose ideas for voting, which are stored in the proposals array.

     ```solidity
     function createProposal(string memory _description) public onlyMember {
         proposals.push(Proposal({ description: _description, votes: 0, executed: false }));
     }
     ```
   - **Vote on a Proposal**:
     Members can vote on active proposals to express approval. Votes increment the respective proposal’s `votes` field.

     ```solidity
     function vote(uint256 _proposalId) public onlyMember {
         Proposal storage proposal = proposals[_proposalId];
         require(!proposal.executed, "Proposal already executed");
         proposal.votes += 1;
     }
     ```

   - **Execute a Proposal**:
     Once a proposal meets the criteria (e.g., votes), it can be executed. This changes its `executed` status to true.

     ```solidity
     function executeProposal(uint256 _proposalId) public onlyOwner {
         Proposal storage proposal = proposals[_proposalId];
         require(!proposal.executed, "Proposal already executed");
         proposal.executed = true;
     }
     ```

5. **Events**
   These are used for tracking and emitting events like member additions, proposal creations, votes, and executions. For example:

   ```solidity
   event MemberAdded(address indexed member);
   event ProposalCreated(uint256 proposalId, string description);
   event VoteCast(uint256 proposalId, address indexed voter);
   event ProposalExecuted(uint256 proposalId);
   ```

## **Contributing**
Feel free to fork this repository, create issues, or submit pull requests to enhance its functionality.