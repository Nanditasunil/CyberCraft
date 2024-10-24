const fs = require('fs');
const crypto = require('crypto');
const math = require('mathjs'); // Ensure you install this library: npm install mathjs

// Function to read key and IV from a JSON file
const readKeyFromFile = (path) => {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    return {
        key: data.key ? Buffer.from(data.key, 'hex') : undefined,
        iv: data.iv ? Buffer.from(data.iv, 'hex') : undefined,
    };
};

// Define algorithms and their corresponding key files
const algorithms = [
    { path: './keys/aes_key.txt', algorithm: 'AES' },
    { path: './keys/des_key.txt', algorithm: 'DES' },
    { path: './keys/logistic_key.txt', algorithm: 'Chaotic Logistic' }
];

// Store results
const results = [];

// Function to test Avalanche Effect
const testAvalancheEffect = (keyBuffer, ivBuffer, algorithm) => {
    const plaintext = Buffer.from('Hello, World!');

    let cipher;
    if (algorithm === 'AES') {
        cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    } else if (algorithm === 'DES') {
        if (keyBuffer.length !== 8) {
            console.error(`Invalid key length for ${algorithm}. Key must be 8 bytes.`);
            return;
        }
        cipher = crypto.createCipheriv('des-cbc', keyBuffer, ivBuffer);
    } else {
        console.log(`${algorithm} is not yet implemented.`);
        return;
    }

    let ciphertext1 = Buffer.concat([cipher.update(plaintext), cipher.final()]);

    // Modify the key slightly (change the last byte for example)
    keyBuffer[keyBuffer.length - 1] ^= 0x01; // Simple bit flip

    // Create the cipher again with the modified key
    if (algorithm === 'AES') {
        cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    } else if (algorithm === 'DES') {
        cipher = crypto.createCipheriv('des-cbc', keyBuffer, ivBuffer);
    }

    let ciphertext2 = Buffer.concat([cipher.update(plaintext), cipher.final()]);

    results.push({
        Algorithm: algorithm,
        Ciphertext1: ciphertext1.toString('hex'),
        Ciphertext2: ciphertext2.toString('hex')
    });
};

// Function to perform frequency analysis
const frequencyAnalysis = (data) => {
    const frequency = Array(256).fill(0);
    for (const byte of data) {
        frequency[byte]++;
    }
    return frequency;
};

// Function to perform chi-squared test
const chiSquaredTest = (observed) => {
    const expected = observed.length / 256; // Uniform distribution
    const chiSquare = observed.reduce((sum, freq) => {
        return sum + ((freq - expected) ** 2) / expected;
    }, 0);
    return chiSquare;
};

// Function to calculate block entropy
const blockEntropy = (data, blockSize) => {
    const entropies = [];
    for (let i = 0; i < data.length; i += blockSize) {
        const block = data.slice(i, i + blockSize);
        const freq = frequencyAnalysis(block);
        const total = block.length;
        const entropy = freq.reduce((sum, freq) => {
            if (freq === 0) return sum;
            const p = freq / total;
            return sum - p * Math.log2(p);
        }, 0);
        entropies.push(entropy);
    }
    return entropies;
};

// Function to calculate correlation analysis
const correlationAnalysis = (data) => {
    const correlations = [];
    for (let i = 1; i < data.length; i++) {
        const correlation = (data[i] * data[i - 1]) / (data[i] + data[i - 1]);
        correlations.push(correlation);
    }
    return correlations;
};

// Function to estimate keyspace
const keyspaceAnalysis = (algorithm) => {
    if (algorithm === 'AES') return 2 ** 256; // AES-256
    if (algorithm === 'DES') return 2 ** 56; // DES
    return undefined;
};

// Read keys and run tests
algorithms.forEach(({ path, algorithm }) => {
    try {
        const { key, iv } = readKeyFromFile(path);
        if (!key || !iv) {
            console.error(`Key or IV missing for ${algorithm}`);
            return;
        }

        console.log(`Key for ${algorithm}: ${key.toString('hex')}`);
        console.log(`IV for ${algorithm}: ${iv.toString('hex')}`);

        // Example encrypted data for analysis
        let encryptedData;
        if (algorithm === 'AES') {
            // You should replace this with actual encrypted data
            encryptedData = Buffer.from('...'); // Replace with actual AES encrypted data
        } else if (algorithm === 'DES') {
            // You should replace this with actual encrypted data
            encryptedData = Buffer.from('...'); // Replace with actual DES encrypted data
        } else {
            console.log(`${algorithm} is not yet implemented.`);
            return;
        }

        // Perform analyses
        const freqAnalysis = frequencyAnalysis(encryptedData);
        const chiSquareValue = chiSquaredTest(freqAnalysis);
        const blockEntropyValues = blockEntropy(encryptedData, 16); // Example block size of 16 bytes
        const correlationValues = correlationAnalysis(encryptedData);

        results.push({
            Algorithm: algorithm,
            ChiSquare: chiSquareValue,
            BlockEntropy: blockEntropyValues,
            Keyspace: keyspaceAnalysis(algorithm)
        });

        testAvalancheEffect(key, iv, algorithm);
    } catch (error) {
        console.error(`Error reading key file: ${path} - ${error.message}`);
    }
});

// Display results in a table
console.table(results);
