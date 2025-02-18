const { create } = require('ipfs-http-client');

// Initialize the IPFS client with Infura
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

// Function to upload file buffer to IPFS
async function uploadToIPFS(fileBuffer) {
    const result = await ipfs.add(fileBuffer);
    return result.path;  // Return the IPFS hash
}

// Function to fetch data from IPFS
async function getFromIPFS(ipfsHash) {
    try {
        const chunks = [];
        for await (const chunk of ipfs.cat(ipfsHash)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString();  // Return the file content
    } catch (error) {
        console.error(`Error fetching IPFS content: ${error.message}`);
        throw error;
    }
}

module.exports = {
    uploadToIPFS,
    getFromIPFS
};
