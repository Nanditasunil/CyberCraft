# Image Encryption and Decryption using AES, DES, and Chaotic Logistic Map

### Project Overview

This project implements image encryption and decryption using three different encryption algorithms: AES, DES, and Chaotic Logistic Map. It also includes features for embedding and extracting watermarks to secure image ownership and a comparative analysis of encryption strength based on statistical metrics like entropy and chi-square tests. The project is designed with a focus on cybersecurity, particularly for use in digital forensics and content protection.

### Features

**Encryption & Decryption:**

AES (Advanced Encryption Standard)
DES (Data Encryption Standard)
Chaotic Logistic Map Algorithm

**Watermarking:**
Embed a digital watermark into images for ownership protection.
Extract embedded watermarks from images to verify ownership.

**Comparative Strength Analysis:**
Perform entropy and chi-square tests to compare the security strength of different algorithms.
Evaluate key strength through randomness and keyspace analysis.

### Prerequisites
Node.js (to run the command-line utilities)
Python (for entropy and statistical analysis, if needed)

### Setup

Clone the repository to your local machine:
####  `git clone https://github.com/Nanditasunil/CyberCraft.git`

Navigate to the project directory:
#### `cd CyberCraft`

Install necessary Node.js dependencies:
#### `npm install`

### How to Use

Run the GUI
To launch the graphical user interface (GUI) for encryption, decryption, and watermarking, simply run:
#### `python encryption_ui.py`

This will open a user-friendly interface to perform encryption, decryption, watermarking, and analysis with ease.

### This project was developed to:

Secure image data using different encryption algorithms.
Analyze and compare the strength of each algorithm using entropy and statistical measures.
Provide watermarking as an additional layer of protection to ensure ownership.
Demonstrate how encryption can be used to protect digital assets in cybersecurity and digital forensics.

### Future Enhancements
Integrate quantum encryption techniques for future encryption methods.
Real-time encryption and decryption for streaming media.
Further research on other image encryption algorithms for more comprehensive comparisons.
