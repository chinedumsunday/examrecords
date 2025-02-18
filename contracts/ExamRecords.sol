// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ExamRecords is AccessControl {
    bytes32 public constant LECTURER_ROLE = keccak256("LECTURER_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    struct ExamResult {
        string ipfsHash;
        uint256 uploadedAt;
        bool isApproved;
    }

    // Course code => Exam Batch ID => IPFS hash
    mapping(string => mapping(string => ExamResult)) public courseExamResults;

    // Events
    event ResultUploaded(string courseCode, string batchId, string ipfsHash, address lecturer);
    event ResultApproved(string courseCode, string batchId, address validator);

    constructor(address admin) {
        // Set up the admin (e.g., contract deployer)
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // Function to assign lecturer role
    function assignLecturer(address lecturer) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(LECTURER_ROLE, lecturer);
    }

    // Function to assign validator role
    function assignValidator(address validator) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, validator);
    }

    // Lecturer uploads exam results as IPFS hash linked to course code and batch ID
    function uploadExamResults(string memory courseCode, string memory batchId, string memory ipfsHash) public onlyRole(LECTURER_ROLE) {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        
        // Store exam result in mapping
        courseExamResults[courseCode][batchId] = ExamResult({
            ipfsHash: ipfsHash,
            uploadedAt: block.timestamp,
            isApproved: false
        });

        emit ResultUploaded(courseCode, batchId, ipfsHash, msg.sender);
    }

    // Validator approves the results
    function approveResults(string memory courseCode, string memory batchId) public onlyRole(VALIDATOR_ROLE) {
        require(bytes(courseExamResults[courseCode][batchId].ipfsHash).length > 0, "No results to approve");
        require(!courseExamResults[courseCode][batchId].isApproved, "Results already approved");

        // Mark results as approved
        courseExamResults[courseCode][batchId].isApproved = true;

        emit ResultApproved(courseCode, batchId, msg.sender);
    }

    // Function to fetch exam result IPFS hash
    function getExamResults(string memory courseCode, string memory batchId) public view returns (string memory ipfsHash, uint256 uploadedAt, bool isApproved) {
        ExamResult memory result = courseExamResults[courseCode][batchId];
        return (result.ipfsHash, result.uploadedAt, result.isApproved);
    }
}
