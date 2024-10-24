import os
import random
import string
import tkinter as tk
from tkinter import messagebox

# Function to save keys to file
def save_key_to_file(filepath, key, iv=None):
    with open(filepath, "w") as file:
        if iv:
            file.write(f'{{"key":"{key}","iv":"{iv}"}}')
        else:
            file.write(f'{{"x0":{key},"r":{iv}}}')

# AES Key Generator
def generate_aes_key():
    key = ''.join(random.choices(string.hexdigits, k=64))  # 256-bit key (64 hex chars)
    iv = ''.join(random.choices(string.hexdigits, k=32))   # 128-bit IV (32 hex chars)
    save_key_to_file("./keys/aes_key.txt", key, iv)
    return key, iv

# DES Key Generator
def generate_des_key():
    key = ''.join(random.choices(string.hexdigits, k=16))  # 64-bit key (16 hex chars)
    iv = ''.join(random.choices(string.hexdigits, k=16))   # 64-bit IV (16 hex chars)
    save_key_to_file("./keys/des_key.txt", key, iv)
    return key, iv

# Logistic Map Key Generator
def generate_logistic_key():
    x0 = round(random.uniform(0, 1), 4)  # Random x0 between 0 and 1
    r = round(random.uniform(3.5, 4.0), 4)  # Random r between 3.5 and 4.0
    save_key_to_file("./keys/logistic_key.txt", x0, r)
    return x0, r

# Function to call the respective commands
def run_command(command):
    result = os.system(command)
    if result == 0:
        messagebox.showinfo("Success", "Operation completed successfully!")
    else:
        messagebox.showerror("Error", "There was an issue running the operation!")

# Encryption function with key generation
def encrypt_algorithm(algorithm):
    if algorithm == "AES":
        key, iv = generate_aes_key()  # Generate new AES key
        run_command("node utils/cli.js -e ./images/image.png -i encrypted.png -p ./keys/aes_key.txt --algorithm aes")
    elif algorithm == "DES":
        key, iv = generate_des_key()  # Generate new DES key
        run_command("node utils/cli.js -e ./images/image.png -i encrypted.png -p ./keys/des_key.txt --algorithm des")
    elif algorithm == "Logistic":
        x0, r = generate_logistic_key()  # Generate new Logistic map key
        run_command("node utils/cli.js -e ./images/image.png -i encrypted.png -p ./keys/logistic_key.txt --algorithm logistic")

# Decryption function
def decrypt_algorithm(algorithm):
    if algorithm == "AES":
        run_command("node utils/cli.js -d encrypted.png -i decrypted.png -k ./keys/aes_key.txt --algorithm aes")
    elif algorithm == "DES":
        run_command("node utils/cli.js -d encrypted.png -i decrypted.png -k ./keys/des_key.txt --algorithm des")
    elif algorithm == "Logistic":
        run_command("node utils/cli.js -d encrypted.png -i decrypted.png -k ./keys/logistic_key.txt --algorithm logistic")

# Watermark embed function
def embed_watermark():
    run_command("node utils/watermarkSteganography.js embed ./images/image.png ./images/watermarkImage.png 'CyberSec'")

# Watermark extract function with alert box
def extract_watermark():
    run_command("node utils/watermarkSteganography.js extract ./images/watermarkImage.png 100")
    
    # Open the extracted watermark image to read its contents
    try:
        with open('./images/watermarkImage.png', 'rb') as file:
            extracted_watermark = file.read()  # Read the watermark
            messagebox.showinfo("Extracted Watermark", extracted_watermark)  # Display in alert box
    except Exception as e:
        messagebox.showerror("Error", f"Could not read extracted watermark: {str(e)}")

# Batch Encryption function
def batch_encrypt():
    run_command("node utils/batchEncryptor.js encrypt ./images ./encrypted ./keys logistic")

# Batch Decryption function
def batch_decrypt():
    run_command("node utils/batchEncryptor.js decrypt ./encrypted ./decrypted ./keys logistic")

# UI setup
window = tk.Tk()
window.title("CyberCraft: Encryption and Decryption Tool")
window.geometry("400x400")

# Menu selection
tk.Label(window, text="Select Operation:").pack()

# Encrypt options
tk.Button(window, text="Encrypt with AES", command=lambda: encrypt_algorithm("AES")).pack(pady=5)
tk.Button(window, text="Encrypt with DES", command=lambda: encrypt_algorithm("DES")).pack(pady=5)
tk.Button(window, text="Encrypt with Logistic", command=lambda: encrypt_algorithm("Logistic")).pack(pady=5)

# Decrypt options
tk.Button(window, text="Decrypt with AES", command=lambda: decrypt_algorithm("AES")).pack(pady=5)
tk.Button(window, text="Decrypt with DES", command=lambda: decrypt_algorithm("DES")).pack(pady=5)
tk.Button(window, text="Decrypt with Logistic", command=lambda: decrypt_algorithm("Logistic")).pack(pady=5)

# Watermark options
tk.Button(window, text="Embed Watermark", command=embed_watermark).pack(pady=5)
tk.Button(window, text="Extract Watermark", command=extract_watermark).pack(pady=5)

# Batch options
tk.Button(window, text="Batch Encrypt (Logistic)", command=batch_encrypt).pack(pady=5)
tk.Button(window, text="Batch Decrypt (Logistic)", command=batch_decrypt).pack(pady=5)

# Run the window
window.mainloop()
