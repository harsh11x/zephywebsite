// Text encryption/decryption utilities
export function generateSecureKey(length = 20): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  let key = ""
  for (let i = 0; i < length; i++) {
    key += charset[array[i] % charset.length]
  }
  return key
}

export async function encryptText(text: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  // Generate a key from the password
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ])

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data)

  // Combine salt, iv, and encrypted data
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(encrypted), salt.length + iv.length)

  return btoa(String.fromCharCode(...result))
}

export async function decryptText(encryptedData: string, password: string): Promise<string> {
  try {
    const data = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((c) => c.charCodeAt(0)),
    )

    const salt = data.slice(0, 16)
    const iv = data.slice(16, 28)
    const encrypted = data.slice(28)

    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    )

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encrypted)

    return new TextDecoder().decode(decrypted)
  } catch (error) {
    throw new Error("Decryption failed. Please check your password.")
  }
}

// File encryption/decryption utilities
export async function encryptFile(file: File, password: string): Promise<{ blob: Blob; originalName: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const data = new Uint8Array(arrayBuffer)

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ])

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data)

  // Store original filename and extension in metadata
  const filenameEncoder = new TextEncoder()
  const filenameData = filenameEncoder.encode(file.name)
  const filenameLength = new Uint32Array([filenameData.length])

  // Combine metadata, salt, iv, and encrypted data
  const result = new Uint8Array(
    4 + filenameData.length + salt.length + iv.length + encrypted.byteLength
  )
  
  let offset = 0
  result.set(new Uint8Array(filenameLength.buffer), offset)
  offset += 4
  result.set(filenameData, offset)
  offset += filenameData.length
  result.set(salt, offset)
  offset += salt.length
  result.set(iv, offset)
  offset += iv.length
  result.set(new Uint8Array(encrypted), offset)

  return {
    blob: new Blob([result], { type: "application/octet-stream" }),
    originalName: file.name
  }
}

export async function decryptFile(file: File, password: string): Promise<{ blob: Blob; originalName: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const data = new Uint8Array(arrayBuffer)

  // Extract metadata
  let offset = 0
  const filenameLength = new Uint32Array(data.slice(0, 4).buffer)[0]
  offset += 4
  
  const filenameData = data.slice(offset, offset + filenameLength)
  const originalName = new TextDecoder().decode(filenameData)
  offset += filenameLength

  const salt = data.slice(offset, offset + 16)
  offset += 16
  const iv = data.slice(offset, offset + 12)
  offset += 12
  const encrypted = data.slice(offset)

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ])

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  )

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encrypted)

  return {
    blob: new Blob([decrypted]),
    originalName: originalName
  }
}
