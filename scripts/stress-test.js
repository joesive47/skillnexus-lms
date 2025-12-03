// Stress Test - 100K concurrent users simulation
const http = require('http');

const config = {
  host: 'localhost',
  port: 3000,
  targetUsers: 100000,
  rampUpTime: 300000, // 5 minutes
  duration: 600000 // 10 minutes
};

let activeUsers = 0;
let completedRequests = 0;
let errors = 0;

async function simulateUser() {
  const endpoints = ['/api/health', '/api/courses', '/dashboard'];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: config.port,
      path: endpoint,
      method: 'GET'
    }, (res) => {
      completedRequests++;
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      errors++;
      resolve(false);
    });

    req.end();
  });
}

async function runStressTest() {
  console.log(`Starting stress test: ${config.targetUsers} users`);
  
  const usersPerSecond = config.targetUsers / (config.rampUpTime / 1000);
  const interval = 1000 / usersPerSecond;

  const rampUp = setInterval(() => {
    if (activeUsers < config.targetUsers) {
      activeUsers++;
      simulateUser();
    }
  }, interval);

  setTimeout(() => {
    clearInterval(rampUp);
    console.log('\n=== Stress Test Results ===');
    console.log(`Active Users: ${activeUsers}`);
    console.log(`Completed Requests: ${completedRequests}`);
    console.log(`Errors: ${errors}`);
    console.log(`Success Rate: ${((completedRequests - errors) / completedRequests * 100).toFixed(2)}%`);
  }, config.duration);
}

runStressTest();
