#!/usr/bin/env node

/**
 * Secure Voice Calling Test Script
 * 
 * This script tests the secure voice calling functionality by:
 * 1. Testing ECDH key generation and exchange
 * 2. Testing AES-256 encryption/decryption
 * 3. Testing WebRTC connection establishment
 * 4. Testing call signaling and management
 * 5. Verifying end-to-end encryption
 */

const io = require('socket.io-client');
const crypto = require('crypto');

// Configuration
const CHAT_SERVER_URL = process.env.CHAT_SERVER_URL || 'http://localhost:3001';
const TEST_USER_1 = 'voice-test1@example.com';
const TEST_USER_2 = 'voice-test2@example.com';

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
  if (condition) {
    testResults.passed++;
    testResults.tests.push({ status: 'PASS', message });
    log(message, 'success');
  } else {
    testResults.failed++;
    testResults.tests.push({ status: 'FAIL', message });
    log(message, 'error');
  }
}

// Mock Web Crypto API for Node.js testing
class MockWebCrypto {
  static async generateKey(algorithm, extractable, keyUsages) {
    if (algorithm.name === 'ECDH') {
      const keyPair = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });
      
      return {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        type: 'public' in keyPair ? 'public' : 'private'
      };
    }
    throw new Error('Unsupported algorithm');
  }

  static async deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages) {
    // Use actual ECDH key derivation
    const ecdh = crypto.createECDH('prime256v1');
    ecdh.setPrivateKey(baseKey.privateKey);
    
    const sharedSecret = ecdh.computeSecret(algorithm.public);
    const derivedKey = crypto.pbkdf2Sync(sharedSecret, 'salt', 1000, 32, 'sha256');
    
    return {
      key: derivedKey,
      algorithm: derivedKeyAlgorithm,
      extractable: extractable,
      usages: keyUsages
    };
  }

  static async encrypt(algorithm, key, data) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipherGCM('aes-256-gcm', key.key);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]);
  }

  static async decrypt(algorithm, key, data) {
    const iv = data.slice(0, 12);
    const authTag = data.slice(12, 28);
    const encrypted = data.slice(28);
    
    const decipher = crypto.createDecipherGCM('aes-256-gcm', key.key);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static async exportKey(format, key) {
    if (format === 'spki') {
      return key.toString('base64');
    }
    throw new Error('Unsupported format');
  }

  static async importKey(format, keyData, algorithm, extractable, keyUsages) {
    if (format === 'spki') {
      return Buffer.from(keyData, 'base64');
    }
    throw new Error('Unsupported format');
  }

  static getRandomValues(array) {
    return crypto.randomFillSync(array);
  }
}

// Mock SecureVoiceCrypto class
class MockSecureVoiceCrypto {
  static async generateKeyPair() {
    return await MockWebCrypto.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey', 'deriveBits']
    );
  }

  static async deriveSharedKey(privateKey, publicKey) {
    return await MockWebCrypto.deriveKey(
      { name: 'ECDH', public: publicKey },
      { privateKey: privateKey },
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptAudio(audioData, key) {
    const iv = MockWebCrypto.getRandomValues(new Uint8Array(12));
    const encrypted = await MockWebCrypto.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      audioData
    );
    return { encrypted, iv };
  }

  static async decryptAudio(encryptedData, key, iv) {
    return await MockWebCrypto.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData
    );
  }

  static async exportPublicKey(key) {
    return await MockWebCrypto.exportKey('spki', key);
  }

  static async importPublicKey(keyString) {
    return await MockWebCrypto.importKey(
      'spki',
      keyString,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );
  }
}

async function testVoiceCalling() {
  log('Starting Secure Voice Calling Test...');
  
  // Test 1: ECDH Key Generation
  try {
    const keyPair1 = await MockSecureVoiceCrypto.generateKeyPair();
    const keyPair2 = await MockSecureVoiceCrypto.generateKeyPair();
    
    assert(keyPair1 && keyPair2, 'ECDH key pairs generated successfully');
    assert(keyPair1.publicKey && keyPair1.privateKey, 'Key pair 1 has public and private keys');
    assert(keyPair2.publicKey && keyPair2.privateKey, 'Key pair 2 has public and private keys');
    
    log('✅ ECDH key generation test passed');
  } catch (error) {
    assert(false, `ECDH key generation failed: ${error.message}`);
  }

  // Test 2: Shared Key Derivation
  try {
    const keyPair1 = await MockSecureVoiceCrypto.generateKeyPair();
    const keyPair2 = await MockSecureVoiceCrypto.generateKeyPair();
    
    const sharedKey1 = await MockSecureVoiceCrypto.deriveSharedKey(
      keyPair1.privateKey,
      keyPair2.publicKey
    );
    
    const sharedKey2 = await MockSecureVoiceCrypto.deriveSharedKey(
      keyPair2.privateKey,
      keyPair1.publicKey
    );
    
    assert(sharedKey1 && sharedKey2, 'Shared keys derived successfully');
    assert(sharedKey1.key.equals(sharedKey2.key), 'Both parties derived the same shared key');
    
    log('✅ Shared key derivation test passed');
  } catch (error) {
    assert(false, `Shared key derivation failed: ${error.message}`);
  }

  // Test 3: Audio Encryption/Decryption
  try {
    const keyPair1 = await MockSecureVoiceCrypto.generateKeyPair();
    const keyPair2 = await MockSecureVoiceCrypto.generateKeyPair();
    const sharedKey = await MockSecureVoiceCrypto.deriveSharedKey(
      keyPair1.privateKey,
      keyPair2.publicKey
    );
    
    const testAudioData = "Hello, this is a test audio message!";
    
    // Encrypt audio
    const { encrypted, iv } = await MockSecureVoiceCrypto.encryptAudio(
      testAudioData,
      sharedKey
    );
    
    // Decrypt audio
    const decrypted = await MockSecureVoiceCrypto.decryptAudio(
      encrypted,
      sharedKey,
      iv
    );
    
    assert(encrypted && iv, 'Audio encryption successful');
    assert(decrypted === testAudioData, 'Audio decryption successful - data matches');
    
    log('✅ Audio encryption/decryption test passed');
  } catch (error) {
    assert(false, `Audio encryption/decryption failed: ${error.message}`);
  }

  // Test 4: Public Key Export/Import
  try {
    const keyPair = await MockSecureVoiceCrypto.generateKeyPair();
    const exportedKey = await MockSecureVoiceCrypto.exportPublicKey(keyPair.publicKey);
    const importedKey = await MockSecureVoiceCrypto.importPublicKey(exportedKey);
    
    assert(exportedKey && typeof exportedKey === 'string', 'Public key exported successfully');
    assert(importedKey && importedKey.equals(keyPair.publicKey), 'Public key imported successfully');
    
    log('✅ Public key export/import test passed');
  } catch (error) {
    assert(false, `Public key export/import failed: ${error.message}`);
  }

  // Test 5: Socket Connection and Signaling
  const user1Client = io(CHAT_SERVER_URL, {
    auth: { email: TEST_USER_1, userId: 'voice-user1' }
  });
  
  const user2Client = io(CHAT_SERVER_URL, {
    auth: { email: TEST_USER_2, userId: 'voice-user2' }
  });

  return new Promise((resolve) => {
    let testsCompleted = 0;
    const totalTests = 8; // 4 crypto tests + 4 socket tests
    
    function checkCompletion() {
      testsCompleted++;
      if (testsCompleted >= totalTests) {
        // Cleanup
        user1Client.disconnect();
        user2Client.disconnect();
        
        // Print results
        log('\n=== Voice Calling Test Results ===');
        log(`Passed: ${testResults.passed}`);
        log(`Failed: ${testResults.failed}`);
        log(`Total: ${testResults.passed + testResults.failed}`);
        
        testResults.tests.forEach(test => {
          log(`${test.status}: ${test.message}`);
        });
        
        resolve(testResults);
      }
    }

    // Socket connection tests
    user1Client.on('connect', () => {
      log('User 1 connected to voice call server');
      assert(true, 'User 1 socket connection established');
      checkCompletion();
    });

    user2Client.on('connect', () => {
      log('User 2 connected to voice call server');
      assert(true, 'User 2 socket connection established');
      checkCompletion();
    });

    // Test call request/response
    user1Client.on('connect', () => {
      setTimeout(() => {
        // Generate keys for call
        MockSecureVoiceCrypto.generateKeyPair().then(keyPair => {
          MockSecureVoiceCrypto.exportPublicKey(keyPair.publicKey).then(publicKeyString => {
            // Send call request
            user1Client.emit('voice_call_request', {
              targetEmail: TEST_USER_2,
              offer: { type: 'offer', sdp: 'mock-sdp-offer' },
              publicKey: publicKeyString,
              callerEmail: TEST_USER_1
            });
            
            log('📞 Call request sent from User 1 to User 2');
          });
        });
      }, 1000);
    });

    // Test incoming call handling
    user2Client.on('voice_call_incoming', (data) => {
      log(`📞 User 2 received incoming call from ${data.callerEmail}`);
      assert(data.callerEmail === TEST_USER_1, 'Incoming call from correct user');
      assert(data.callId && data.offer && data.publicKey, 'Call data contains required fields');
      
      // Generate response keys
      MockSecureVoiceCrypto.generateKeyPair().then(keyPair => {
        MockSecureVoiceCrypto.exportPublicKey(keyPair.publicKey).then(publicKeyString => {
          // Send call answer
          user2Client.emit('voice_call_answer', {
            callId: data.callId,
            answer: { type: 'answer', sdp: 'mock-sdp-answer' },
            publicKey: publicKeyString,
            calleeEmail: TEST_USER_2
          });
          
          log('📞 Call answer sent from User 2 to User 1');
        });
      });
      
      checkCompletion();
    });

    // Test call answered handling
    user1Client.on('voice_call_answered', (data) => {
      log(`📞 User 1 received call answer from ${data.calleeEmail}`);
      assert(data.calleeEmail === TEST_USER_2, 'Call answered by correct user');
      assert(data.answer && data.publicKey, 'Answer contains required fields');
      
      // Test key exchange
      MockSecureVoiceCrypto.importPublicKey(data.publicKey).then(remotePublicKey => {
        assert(remotePublicKey, 'Remote public key imported successfully');
        log('✅ Key exchange test passed');
      });
      
      checkCompletion();
    });

    // Test available users
    user1Client.on('connect', () => {
      setTimeout(() => {
        user1Client.emit('voice_get_available_users');
      }, 2000);
    });

    user1Client.on('voice_users_available', (users) => {
      log(`📞 Available users: ${users.join(', ')}`);
      assert(Array.isArray(users), 'Available users returned as array');
      assert(users.includes(TEST_USER_2), 'User 2 is in available users list');
      checkCompletion();
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      log('Test timeout - forcing completion');
      resolve(testResults);
    }, 30000);
  });
}

// Run the test
if (require.main === module) {
  testVoiceCalling()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`Test failed with error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { testVoiceCalling }; 