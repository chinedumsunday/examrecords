const axios = require('axios');
const FormData = require('form-data');

// Upload to local IPFS node
async function uploadToIPFS(fileBuffer) {
    const formData = new FormData();
    formData.append('file', fileBuffer);

    try {
        const res = await axios.post('http://localhost:5001/api/v0/add', formData, {
            headers: formData.getHeaders()
        });
        return res.data.Hash;  // Return the IPFS hash
    } catch (err) {
        throw new Error('IPFS upload failed');
    }
}

module.exports = { uploadToIPFS };
