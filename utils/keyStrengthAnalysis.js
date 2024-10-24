const fs = require('fs');

// Function to calculate the strength of a key using entropy
const calculateEntropy = data => {
	const frequency = {};
	for (const byte of data) {
		frequency[byte] = (frequency[byte] || 0) + 1;
	}

	let entropy = 0;
	const length = data.length;
	for (const key in frequency) {
		const prob = frequency[key] / length;
		entropy -= prob * Math.log2(prob);
	}
	return entropy;
};

// Function to read the key file and analyze its strength
const analyzeKeyStrength = (filePath, algorithm) => {
	if (!fs.existsSync(filePath)) {
		console.error(`Key file not found: ${filePath}`);
		return { algorithm, filePath, entropy: null };
	}

	try {
		const data = fs.readFileSync(filePath);
		const entropy = calculateEntropy(data);
		return { algorithm, filePath, entropy };
	} catch (error) {
		console.error(`Error reading ${filePath}:`, error);
		return { algorithm, filePath, entropy: null };
	}
};

// Main function to run the analysis
const runAnalysis = () => {
	const keyFiles = [
		{ path: './keys/aes_key.txt', algorithm: 'AES' },
		{ path: './keys/des_key.txt', algorithm: 'DES' },
		{ path: './keys/logistic_key.txt', algorithm: 'Chaotic Logistic' }
	];

	const results = keyFiles.map(({ path, algorithm }) =>
		analyzeKeyStrength(path, algorithm)
	);

	// Display results in a table format
	console.table(results);
};

// Run the analysis
runAnalysis();
