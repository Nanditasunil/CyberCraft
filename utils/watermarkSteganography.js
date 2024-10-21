const fs = require('fs');
const Jimp = require('jimp');

// Function to embed a watermark using LSB (Least Significant Bit) steganography
function embedWatermarkLSB(inputPath, outputPath, watermarkText) {
	Jimp.read(inputPath)
		.then(image => {
			const binaryWatermark = textToBinary(watermarkText);
			let binaryIndex = 0;

			for (let y = 0; y < image.bitmap.height; y++) {
				for (let x = 0; x < image.bitmap.width; x++) {
					if (binaryIndex < binaryWatermark.length) {
						const pixelColor = Jimp.intToRGBA(
							image.getPixelColor(x, y)
						);
						const newBlue =
							(pixelColor.b & 0xfe) |
							parseInt(binaryWatermark[binaryIndex]);
						binaryIndex++;

						const newColor = Jimp.rgbaToInt(
							pixelColor.r,
							pixelColor.g,
							newBlue,
							pixelColor.a
						);
						image.setPixelColor(newColor, x, y);
					}
				}
			}

			// Save the image to outputPath
			return image
				.writeAsync(outputPath)
				.then(() => {
					console.log(
						`Watermark embedded successfully in ${outputPath}`
					);
				})
				.catch(err => {
					console.error(`Error writing the output file:`, err);
				});
		})
		.catch(err => {
			console.error(`Error processing the image:`, err);
		});
}

// Function to extract a watermark using LSB
function extractWatermarkLSB(inputPath, length) {
	Jimp.read(inputPath)
		.then(image => {
			let binaryWatermark = '';

			for (
				let y = 0;
				y < image.bitmap.height && binaryWatermark.length < length * 8;
				y++
			) {
				for (
					let x = 0;
					x < image.bitmap.width &&
					binaryWatermark.length < length * 8;
					x++
				) {
					const pixelColor = Jimp.intToRGBA(
						image.getPixelColor(x, y)
					);
					binaryWatermark += (pixelColor.b & 0x01).toString();
				}
			}

			const extractedText = binaryToText(binaryWatermark);
			console.log(`Extracted Watermark: "${extractedText}"`);
		})
		.catch(err => {
			console.error(`Error extracting watermark:`, err);
		});
}

// Helper function to convert text to binary
function textToBinary(text) {
	return text
		.split('')
		.map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
		.join('');
}

// Helper function to convert binary to text
function binaryToText(binary) {
	let text = '';
	for (let i = 0; i < binary.length; i += 8) {
		const byte = binary.slice(i, i + 8);
		text += String.fromCharCode(parseInt(byte, 2));
	}
	return text;
}

// Parse the command-line arguments
const mode = process.argv[2]; // 'embed' or 'extract'
const inputPath = process.argv[3]; // Input image path
const outputOrLength = process.argv[4]; // Output path for embedding or watermark length for extraction

if (mode === 'embed') {
	const watermarkText = process.argv[5]; // Watermark text
	if (!inputPath || !outputOrLength || !watermarkText) {
		console.error(
			'Usage: node watermarkSteganography.js embed <inputImagePath> <outputImagePath> <watermarkText>'
		);
		process.exit(1);
	}
	embedWatermarkLSB(inputPath, outputOrLength, watermarkText);
} else if (mode === 'extract') {
	const watermarkLength = parseInt(outputOrLength, 10); // Watermark length for extraction
	if (!inputPath || isNaN(watermarkLength)) {
		console.error(
			'Usage: node watermarkSteganography.js extract <inputImagePath> <watermarkLength>'
		);
		process.exit(1);
	}
	extractWatermarkLSB(inputPath, watermarkLength);
} else {
	console.error("Invalid mode! Use 'embed' or 'extract'.");
	process.exit(1);
}
