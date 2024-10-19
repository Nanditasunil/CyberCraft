const fs = require('fs');
const crypto = require('crypto');

// Function to encrypt the image
function encryptImage(inputFilePath, outputFilePath, keyFilePath, algorithm) {
    let selectedAlgorithm;
    let key;
    let iv;

    if (algorithm === 'aes') {
        selectedAlgorithm = 'aes-256-cbc';
        key = crypto.randomBytes(32); // 32 bytes key for AES-256
        iv = crypto.randomBytes(16); // 16 bytes IV for AES
    } else if (algorithm === 'des') {
        selectedAlgorithm = 'des-ede3-cbc';
        key = crypto.randomBytes(24); // 24 bytes key for Triple DES
        iv = crypto.randomBytes(8); // 8 bytes IV for DES
    } else {
        console.error('Unsupported algorithm. Please use "aes" or "des".');
        return;
    }

    const cipher = crypto.createCipheriv(selectedAlgorithm, key, iv);
    const input = fs.createReadStream(inputFilePath);
    const output = fs.createWriteStream(outputFilePath);

    input.pipe(cipher).pipe(output);

    // Save the key and IV to a file
    const keyAndIv = {
        key: key.toString('hex'),
        iv: iv.toString('hex')
    };

    fs.writeFileSync(keyFilePath, JSON.stringify(keyAndIv), 'utf8');

    output.on('finish', () => {
        console.log('Encryption complete. Key saved to', keyFilePath);
    });
}

// Function to decrypt the image
function decryptImage(inputFilePath, outputFilePath, keyFilePath, algorithm) {
    let selectedAlgorithm;

    if (algorithm === 'aes') {
        selectedAlgorithm = 'aes-256-cbc';
    } else if (algorithm === 'des') {
        selectedAlgorithm = 'des-ede3-cbc';
    } else {
        console.error('Unsupported algorithm. Please use "aes" or "des".');
        return;
    }

    // Read the key and IV from the key file
    const { key, iv } = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    const decipher = crypto.createDecipheriv(selectedAlgorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

    const input = fs.createReadStream(inputFilePath);
    const output = fs.createWriteStream(outputFilePath);

    input.pipe(decipher).pipe(output);

    output.on('finish', () => {
        console.log('Decryption complete. Decrypted image saved to', outputFilePath);
    });
}

module.exports = {
    encryptImage,
    decryptImage
};
