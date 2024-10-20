const fs = require('fs');
const crypto = require('crypto');

// Function to generate logistic map key sequence
function logisticKeySequence(size, x0, r) {
    const sequence = new Array(size);
    let x = x0;

    for (let i = 0; i < size; i++) {
        x = r * x * (1 - x);
        sequence[i] = Math.floor(x * 256); // Scale the sequence to byte values (0-255)
    }

    return Buffer.from(sequence);
}

// Function to encrypt the image using Logistic Map algorithm
function logisticEncrypt(inputFilePath, outputFilePath, keyFilePath) {
    const input = fs.readFileSync(inputFilePath);
    const logisticKey = logisticKeySequence(input.length, 0.5, 3.9); // Initial logistic parameters

    const encrypted = Buffer.alloc(input.length);
    for (let i = 0; i < input.length; i++) {
        encrypted[i] = input[i] ^ logisticKey[i]; // XOR with logistic key sequence
    }

    fs.writeFileSync(outputFilePath, encrypted);

    // Save logistic parameters as key
    const keyData = { x0: 0.5, r: 3.9 };
    fs.writeFileSync(keyFilePath, JSON.stringify(keyData), 'utf8');

    console.log('Encryption complete with Logistic Map. Key saved to', keyFilePath);
}

// Function to decrypt the image using Logistic Map algorithm
function logisticDecrypt(inputFilePath, outputFilePath, keyFilePath) {
    const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    const { x0, r } = keyData;

    const input = fs.readFileSync(inputFilePath);
    const logisticKey = logisticKeySequence(input.length, x0, r); // Generate the same key sequence

    const decrypted = Buffer.alloc(input.length);
    for (let i = 0; i < input.length; i++) {
        decrypted[i] = input[i] ^ logisticKey[i]; // XOR with logistic key sequence
    }

    fs.writeFileSync(outputFilePath, decrypted);
    console.log('Decryption complete with Logistic Map. Decrypted image saved to', outputFilePath);
}

// Function to encrypt the image using AES or DES
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
    } else if (algorithm === 'logistic') {
        console.log('Using logistic encryption...');
        logisticEncrypt(inputFilePath, outputFilePath, keyFilePath);
        return;
    } else {
        console.error('Unsupported algorithm. Please use "aes", "des", or "logistic".');
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

// Function to decrypt the image using AES or DES
function decryptImage(inputFilePath, outputFilePath, keyFilePath, algorithm) {
    let selectedAlgorithm;

    if (algorithm === 'aes') {
        selectedAlgorithm = 'aes-256-cbc';
    } else if (algorithm === 'des') {
        selectedAlgorithm = 'des-ede3-cbc';
    } else if (algorithm === 'logistic') {
        console.log('Using logistic decryption...');
        logisticDecrypt(inputFilePath, outputFilePath, keyFilePath);
        return;
    } else {
        console.error('Unsupported algorithm. Please use "aes", "des", or "logistic".');
        return;
    }

    // Read the key and IV from the key file
    const { key, iv } = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    const decipher = crypto.createDecipheriv(
        selectedAlgorithm,
        Buffer.from(key, 'hex'),
        Buffer.from(iv, 'hex')
    );

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
