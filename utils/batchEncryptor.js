const fs = require('fs');
const path = require('path');
const { encryptImage, decryptImage } = require('./encryptor'); // Assuming you have an encryptor.js for encryption/decryption logic

// Usage: node batchEncryptor.js [encrypt|decrypt] inputFolder outputFolder keyFolder algorithm
const mode = process.argv[2]; // encrypt or decrypt
const inputFolder = process.argv[3]; // Folder containing input images
const outputFolder = process.argv[4]; // Folder to save output images
const keyFolder = process.argv[5]; // Folder to save/read keys
const algorithm = process.argv[6]; // Algorithm to use (e.g., logistic)

if (!fs.existsSync(outputFolder)) {
	fs.mkdirSync(outputFolder);
}

if (!fs.existsSync(keyFolder)) {
	fs.mkdirSync(keyFolder);
}

// Function to process all images in the input folder
fs.readdir(inputFolder, (err, files) => {
	if (err) {
		console.error('Error reading input folder:', err);
		return;
	}

	files.forEach(file => {
		const imageName = path.basename(file, path.extname(file)); // Image name without extension
		const inputFile = path.join(inputFolder, file);
		const outputFile = path.join(outputFolder, `${imageName}.png`);
		const keyFileName = path.join(keyFolder, `${imageName}_key.txt`);

		if (mode === 'encrypt') {
			console.log(`Encrypting ${file} using ${algorithm} algorithm...`);
			encryptImage(inputFile, outputFile, keyFileName, algorithm);
		} else if (mode === 'decrypt') {
			console.log(`Decrypting ${file} using ${algorithm} algorithm...`);
			decryptImage(inputFile, outputFile, keyFileName, algorithm);
		} else {
			console.error("Invalid mode! Use 'encrypt' or 'decrypt'.");
		}
	});
});
