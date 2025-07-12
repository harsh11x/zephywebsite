const io = require('socket.io-client');

// Test configuration
const SERVER_URL = 'http://localhost:3001';
const TEST_USERS = [
  { email: 'test1@example.com', userId: 'user1' },
  { email: 'test2@example.com', userId: 'user2' }
];

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName} - PASSED`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - FAILED`);
    if (details) console.log(`   Details: ${details}`);
  }
}

async function runTests() {
  console.log('🚀 Starting Voice & Video Call Tests...\n');

  // Test 1: Socket Connection
  console.log('📡 Test 1: Socket Connection');
  try {
    const socket1 = io(SERVER_URL, {
      auth: TEST_USERS[0],
      timeout: 5000
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), 5000);
      
      socket1.on('connect', () => {
        clearTimeout(timeout);
        logTest('Socket connection established', true);
        resolve();
      });

      socket1.on('connect_error', (error) => {
        clearTimeout(timeout);
        logTest('Socket connection', false, error.message);
        reject(error);
      });
    });

    socket1.disconnect();
  } catch (error) {
    logTest('Socket connection', false, error.message);
  }

  // Test 2: User Discovery
  console.log('\n👥 Test 2: User Discovery');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });
    const socket2 = io(SERVER_URL, { auth: TEST_USERS[1] });

    await new Promise((resolve) => {
      setTimeout(resolve, 3000); // Wait longer for connections
    });

    // Request available users
    socket1.emit('voice_get_available_users');

    await new Promise((resolve) => {
      socket1.on('voice_users_available', (users) => {
        const hasBothUsers = users.includes(TEST_USERS[0].email) && users.includes(TEST_USERS[1].email);
        logTest('User discovery', hasBothUsers, `Found users: ${users.join(', ')}`);
        resolve();
      });

      setTimeout(() => {
        logTest('User discovery', false, 'Timeout waiting for users');
        resolve();
      }, 5000);
    });

    socket1.disconnect();
    socket2.disconnect();
  } catch (error) {
    logTest('User discovery', false, error.message);
  }

  // Test 3: Voice Call Signaling
  console.log('\n📞 Test 3: Voice Call Signaling');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });
    const socket2 = io(SERVER_URL, { auth: TEST_USERS[1] });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let callReceived = false;
    let callAnswered = false;

    // Set up call receiver
    socket2.on('voice_call_incoming', (data) => {
      callReceived = true;
      logTest('Incoming call notification', true, `Call from ${data.callerEmail}`);
      
      // Simulate answering the call
      socket2.emit('voice_call_answer', {
        callId: data.callId,
        answer: { type: 'answer', sdp: 'test-sdp' },
        publicKey: 'test-public-key',
        calleeEmail: TEST_USERS[1].email
      });
    });

    // Set up call answer handler
    socket1.on('voice_call_answered', (data) => {
      callAnswered = true;
      logTest('Call answer received', true, `Answered by ${data.calleeEmail}`);
    });

    // Initiate call
    socket1.emit('voice_call_request', {
      targetEmail: TEST_USERS[1].email,
      offer: { type: 'offer', sdp: 'test-sdp' },
      publicKey: 'test-public-key',
      callerEmail: TEST_USERS[0].email,
      hasVideo: false
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        logTest('Voice call signaling', callReceived && callAnswered, 
          `Received: ${callReceived}, Answered: ${callAnswered}`);
        resolve();
      }, 3000);
    });

    socket1.disconnect();
    socket2.disconnect();
  } catch (error) {
    logTest('Voice call signaling', false, error.message);
  }

  // Test 4: Video Call Signaling
  console.log('\n📹 Test 4: Video Call Signaling');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });
    const socket2 = io(SERVER_URL, { auth: TEST_USERS[1] });

    await new Promise((resolve) => setTimeout(resolve, 4000));

    let videoCallReceived = false;
    let videoCallAnswered = false;
    let retries = 0;

    // Log all incoming events
    socket2.onAny((event, ...args) => {
      console.log(`[socket2] Event: ${event}`, ...args);
    });
    socket1.onAny((event, ...args) => {
      console.log(`[socket1] Event: ${event}`, ...args);
    });

    // Set up video call receiver
    socket2.on('voice_call_incoming', (data) => {
      if (data.hasVideo === true) {
        videoCallReceived = true;
        logTest('Incoming video call notification', true, `Video call from ${data.callerEmail}`);
        // Simulate answering the video call
        socket2.emit('voice_call_answer', {
          callId: data.callId,
          answer: { type: 'answer', sdp: 'test-video-sdp' },
          publicKey: 'test-public-key',
          calleeEmail: TEST_USERS[1].email
        });
      } else {
        logTest('Incoming video call notification', false, `hasVideo missing or false: ${JSON.stringify(data)}`);
        if (retries < 3) {
          retries++;
          setTimeout(() => {
            socket1.emit('voice_call_request', {
              targetEmail: TEST_USERS[1].email,
              offer: { type: 'offer', sdp: 'test-video-sdp' },
              publicKey: 'test-public-key',
              callerEmail: TEST_USERS[0].email,
              hasVideo: true
            });
          }, 1000);
        }
      }
    });

    // Set up video call answer handler
    socket1.on('voice_call_answered', (data) => {
      if (data.hasVideo === true) {
        videoCallAnswered = true;
        logTest('Video call answer received', true, `Video call answered by ${data.calleeEmail}`);
      } else {
        logTest('Video call answer received', false, `hasVideo missing or false: ${JSON.stringify(data)}`);
      }
    });

    // Initiate video call (force hasVideo boolean)
    socket1.emit('voice_call_request', {
      targetEmail: TEST_USERS[1].email,
      offer: { type: 'offer', sdp: 'test-video-sdp' },
      publicKey: 'test-public-key',
      callerEmail: TEST_USERS[0].email,
      hasVideo: true
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        logTest('Video call signaling', videoCallReceived && videoCallAnswered, 
          `Received: ${videoCallReceived}, Answered: ${videoCallAnswered}`);
        resolve();
      }, 10000);
    });

    socket1.disconnect();
    socket2.disconnect();
  } catch (error) {
    logTest('Video call signaling', false, error.message);
  }

  // Test 5: Call Rejection
  console.log('\n🚫 Test 5: Call Rejection');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });
    const socket2 = io(SERVER_URL, { auth: TEST_USERS[1] });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let callRejected = false;

    // Set up call receiver
    socket2.on('voice_call_incoming', (data) => {
      // Simulate rejecting the call
      socket2.emit('voice_call_reject', {
        callId: data.callId,
        userEmail: TEST_USERS[1].email
      });
    });

    // Set up rejection handler
    socket1.on('voice_call_rejected', (data) => {
      callRejected = true;
      logTest('Call rejection', true, `Call rejected by ${data.rejectedBy}`);
    });

    // Initiate call
    socket1.emit('voice_call_request', {
      targetEmail: TEST_USERS[1].email,
      offer: { type: 'offer', sdp: 'test-sdp' },
      publicKey: 'test-public-key',
      callerEmail: TEST_USERS[0].email,
      hasVideo: false
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        logTest('Call rejection handling', callRejected, `Rejected: ${callRejected}`);
        resolve();
      }, 3000);
    });

    socket1.disconnect();
    socket2.disconnect();
  } catch (error) {
    logTest('Call rejection', false, error.message);
  }

  // Test 6: Call Statistics
  console.log('\n📊 Test 6: Call Statistics');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let statsReceived = false;

    socket1.on('voice_call_stats', (stats) => {
      statsReceived = true;
      logTest('Call statistics', true, 
        `Total: ${stats.totalCalls}, Duration: ${stats.totalDuration}, Encrypted: ${stats.encryptedCalls}, Video: ${stats.videoCalls || 0}`);
    });

    socket1.emit('voice_get_stats');

    await new Promise((resolve) => {
      setTimeout(() => {
        logTest('Call statistics retrieval', statsReceived, `Stats received: ${statsReceived}`);
        resolve();
      }, 3000);
    });

    socket1.disconnect();
  } catch (error) {
    logTest('Call statistics', false, error.message);
  }

  // Test 7: Real-time User Availability
  console.log('\n🔄 Test 7: Real-time User Availability');
  try {
    const socket1 = io(SERVER_URL, { auth: TEST_USERS[0] });
    const socket2 = io(SERVER_URL, { auth: TEST_USERS[1] });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    let usersUpdated = false;
    let initialUsersReceived = false;

    socket1.on('voice_users_available', (users) => {
      if (!initialUsersReceived) {
        initialUsersReceived = true;
        console.log('Initial users received:', users);
      } else {
        usersUpdated = true;
        logTest('Real-time user updates', true, `Available users: ${users.join(', ')}`);
      }
    });

    // Disconnect second user to trigger update
    setTimeout(() => {
      console.log('Disconnecting second user...');
      socket2.disconnect();
    }, 2000);

    await new Promise((resolve) => {
      setTimeout(() => {
        logTest('Real-time user availability', usersUpdated, `Users updated: ${usersUpdated}`);
        resolve();
      }, 6000);
    });

    socket1.disconnect();
  } catch (error) {
    logTest('Real-time user availability', false, error.message);
  }

  // Summary
  console.log('\n📋 Test Summary');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Voice and video calling system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server configuration and network connectivity.');
  }

  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run tests
runTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
}); 