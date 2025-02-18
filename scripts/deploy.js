async function main() {
    // Get the contract factory
    const ExamRecords = await ethers.getContractFactory("ExamRecords");

    // Deploy the contract, with deployer as the admin
    const [deployer] = await ethers.getSigners();
    const contract = await ExamRecords.deploy(deployer.address);

    console.log("Contract deployed to:", contract.address);
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
