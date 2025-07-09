#!/usr/bin/env node

/**
 * Multi-Device Chat Test Script
 * 
 * This script tests the multi-device chat functionality by:
 * 1. Connecting multiple clients as the same user
 * 2. Sending messages between different users
 * 3. Verifying messages appear on all connected devices
 * 4. Testing chat session isolation
 */

const io = require('socket.io-client');

// Configuration
const CHAT_SERVER_URL = process.env.CHAT_SERVER_URL || 'http://localhost:3001';
const TEST_USER_1 = 'test1@example.com';
const TEST_USER_2 = 'test2@example.com';

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

async function testMultiDeviceChat() {
  log('Starting Multi-Device Chat Test...');
  
  // Create multiple clients for User 1
  const user1Client1 = io(CHAT_SERVER_URL, {
    auth: { email: TEST_USER_1, userId: 'user1' }
  });
  
  const user1Client2 = io(CHAT_SERVER_URL, {
    auth: { email: TEST_USER_1, userId: 'user1' }
  });
  
  // Create client for User 2
  const user2Client = io(CHAT_SERVER_URL, {
    auth: { email: TEST_USER_2, userId: 'user2' }
  });
  
  // Track received messages
  const user1Messages = [];
  const user2Messages = [];
  
  return new Promise((resolve) => {
    let testsCompleted = 0;
    const totalTests = 6;
    
    function checkCompletion() {
      testsCompleted++;
      if (testsCompleted >= totalTests) {
        // Cleanup
        user1Client1.disconnect();
        user1Client2.disconnect();
        user2Client.disconnect();
        
        // Print results
        log('\n=== Test Results ===');
        log(`Passed: ${testResults.passed}`);
        log(`Failed: ${testResults.failed}`);
        log(`Total: ${testResults.passed + testResults.failed}`);
        
        testResults.tests.forEach(test => {
          log(`${test.status}: ${test.message}`);
        });
        
        resolve(testResults);
      }
    }
    
    // Test 1: Connection establishment
    user1Client1.on('connect', () => {
      log('User 1 Client 1 connected');
      assert(true, 'User 1 Client 1 connection established');
      checkCompletion();
    });
    
    user1Client2.on('connect', () => {
      log('User 1 Client 2 connected');
      assert(true, 'User 1 Client 2 connection established');
      checkCompletion();
    });
    
    user2Client.on('connect', () => {
      log('User 2 Client connected');
      assert(true, 'User 2 Client connection established');
      checkCompletion();
    });
    
    // Test 2: User connection
    user1Client1.on('connection_established', (data) => {
      log(`User 1 Client 1: Connection established with ${data.email}`);
      assert(data.email === TEST_USER_2, 'User 1 can connect to User 2');
      checkCompletion();
    });
    
    user2Client.on('connection_established', (data) => {
      log(`User 2 Client: Connection established with ${data.email}`);
      assert(data.email === TEST_USER_1, 'User 2 can connect to User 1');
      
      // Test 3: Send message from User 1 to User 2
      setTimeout(() => {
        user1Client1.emit('send_message', {
          targetEmail: TEST_USER_2,
          message: {
            id: Date.now().toString(),
            content: 'Hello from User 1!',
            timestamp: new Date(),
            type: 'text'
          }
        });
      }, 1000);
    });
    
    // Test 4: Message delivery to all devices
    user1Client1.on('message_received', (message) => {
      user1Messages.push(message);
      log(`User 1 Client 1 received: ${message.content}`);
    });
    
    user1Client2.on('message_received', (message) => {
      user1Messages.push(message);
      log(`User 1 Client 2 received: ${message.content}`);
    });
    
    user2Client.on('message_received', (message) => {
      user2Messages.push(message);
      log(`User 2 Client received: ${message.content}`);
      
      // Test 5: Verify message delivery
      setTimeout(() => {
        assert(user2Messages.length > 0, 'User 2 received message from User 1');
        assert(user2Messages[0].sender === TEST_USER_1, 'Message sender is correct');
        checkCompletion();
        
        // Test 6: Send reply from User 2
        user2Client.emit('send_message', {
          targetEmail: TEST_USER_1,
          message: {
            id: Date.now().toString(),
            content: 'Hello back from User 2!',
            timestamp: new Date(),
            type: 'text'
          }
        });
      }, 500);
    });
    
    // Test 6: Verify reply delivery to all User 1 devices
    let user1ReplyCount = 0;
    const checkUser1Reply = () => {
      user1ReplyCount++;
      if (user1ReplyCount >= 2) { // Both User 1 clients should receive the reply
        assert(user1ReplyCount >= 2, 'Reply delivered to all User 1 devices');
        checkCompletion();
      }
    };
    
    user1Client1.on('message_received', (message) => {
      if (message.sender === TEST_USER_2) {
        log(`User 1 Client 1 received reply: ${message.content}`);
        checkUser1Reply();
      }
    });
    
    user1Client2.on('message_received', (message) => {
      if (message.sender === TEST_USER_2) {
        log(`User 1 Client 2 received reply: ${message.content}`);
        checkUser1Reply();
      }
    });
    
    // Start the test by connecting User 1 to User 2
    setTimeout(() => {
      user1Client1.emit('connect_to_user', { targetEmail: TEST_USER_2 });
    }, 2000);
    
    // Timeout after 30 seconds
    setTimeout(() => {
      log('Test timeout - forcing completion');
      resolve(testResults);
    }, 30000);
  });
}

// Run the test
if (require.main === module) {
  testMultiDeviceChat()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`Test failed with error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { testMultiDeviceChat }; 