// Advanced encryption utilities for Zephyrn Securities
export class ZephyrnCrypto {
  private static readonly ALGORITHM = "AES-GCM"
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12
  private static readonly SALT_LENGTH = 16
  private static readonly ITERATIONS = 100000

  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"],
    )
  }

  static async encryptFile(
    file: File,
    password: string,
  ): Promise<{
    encryptedData: ArrayBuffer
    salt: Uint8Array
    iv: Uint8Array
    keyId: string
  }> {
    const fileData = await file.arrayBuffer()
    const encoder = new TextEncoder()

    // Generate salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))

    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ["encrypt"],
    )

    // Encrypt the file
    const encryptedData = await crypto.subtle.encrypt({ name: this.ALGORITHM, iv: iv }, key, fileData)

    // Generate unique key ID
    const keyId = crypto.randomUUID()

    return {
      encryptedData,
      salt,
      iv,
      keyId,
    }
  }

  static async decryptFile(
    encryptedData: ArrayBuffer,
    password: string,
    salt: Uint8Array,
    iv: Uint8Array,
  ): Promise<ArrayBuffer> {
    const encoder = new TextEncoder()

    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ["decrypt"],
    )

    // Decrypt the file
    return await crypto.subtle.decrypt({ name: this.ALGORITHM, iv: iv }, key, encryptedData)
  }

  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }
}
