const meow = require('meow');
const meowHelp = require('cli-meow-help');
const { encryptImage, decryptImage } = require('./encryptor'); // Adjust the path as needed

const flags = {
    encrypt: {
        type: 'string',
        desc: 'The image to encrypt',
        alias: 'e'
    },
    decrypt: {
        type: 'string',
        desc: 'The image to decrypt',
        alias: 'd'
    },
    outputImageFileName: {
        type: 'string',
        desc: 'The output image file name',
        alias: 'i'
    },
    outputKeyFileName: {
        type: 'string',
        desc: 'The output key file name',
        alias: 'p'
    },
    key: {
        type: 'string',
        desc: 'The key file to use for decryption',
        alias: 'k'
    },
    clear: {
        type: 'boolean',
        default: false,
        alias: 'c',
        desc: 'Clear the console'
    },
    noClear: {
        type: 'boolean',
        default: true,
        desc: "Don't clear the console"
    },
    version: {
        type: 'boolean',
        alias: 'v',
        desc: 'Print CLI version'
    },
    algorithm: {
        type: 'string',
        desc: 'Encryption algorithm to use (e.g., aes, des, logistic)',
        alias: 'a'
    }
};

const commands = {
    help: { desc: 'Print help info' }
};

const helpText = meowHelp({
    name: 'imcrypt',
    flags,
    commands
});

const options = {
    inferType: true,
    description: false,
    hardRejection: false,
    flags
};

const cli = meow(helpText, options);

// Check if the encrypt flag is provided
if (cli.flags.encrypt) {
    const inputFilePath = cli.flags.encrypt;
    const outputFilePath = cli.flags.outputImageFileName || 'encrypted.png';
    const keyFilePath = cli.flags.outputKeyFileName || 'key.txt';
    const algorithm = cli.flags.algorithm || 'aes';

    encryptImage(inputFilePath, outputFilePath, keyFilePath, algorithm);
}

// Check if the decrypt flag is provided
if (cli.flags.decrypt) {
    const inputFilePath = cli.flags.decrypt;
    const outputFilePath = cli.flags.outputImageFileName || 'decrypted.png';
    const keyFilePath = cli.flags.key || 'key.txt';
    const algorithm = cli.flags.algorithm || 'aes';

    decryptImage(inputFilePath, outputFilePath, keyFilePath, algorithm);
}
