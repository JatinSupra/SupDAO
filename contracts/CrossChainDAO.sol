// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CrossChainDAO {
    struct Proposal {
        uint id;
        string description;
        uint voteCount;
        bool executed;
    }

    address public owner;
    uint public proposalCount;
    mapping(uint => Proposal) public proposals;
    mapping(address => bool) public members;

    event ProposalCreated(uint id, string description);
    event VoteCasted(uint id, address voter);
    event ProposalExecuted(uint id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender], "Only DAO members can vote");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addMember(address _member) external onlyOwner {
        members[_member] = true;
    }

    function createProposal(string memory _description) external onlyMember {
        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, _description, 0, false);
        emit ProposalCreated(proposalCount, _description);
    }

    function vote(uint _id) external onlyMember {
        Proposal storage proposal = proposals[_id];
        require(!proposal.executed, "Proposal already executed");
        proposal.voteCount++;
        emit VoteCasted(_id, msg.sender);
    }

    function executeProposal(uint _id) external onlyOwner {
        Proposal storage proposal = proposals[_id];
        require(!proposal.executed, "Proposal already executed");
        require(proposal.voteCount > 0, "Insufficient votes to execute the proposal");
        proposal.executed = true;
        emit ProposalExecuted(_id);
    }
}
