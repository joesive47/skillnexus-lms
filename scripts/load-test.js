// Load Testing Script
const https = require('https');

const config = {
  host: 'localhost',
  port: 3000,
  duration: 60000, // 1 minute
  concurrency: 100,
  endpoints: [
    '/api/health',
    '/api/courses',
    '/api/auth/session'
  ]
};

let stats = {
  requests: 0,
  success: 0,
  errors: 0,
  totalTime: 0,
  minTime: Infinity,
  maxTime: 0
};

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const start = Date.now();
    
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: endpoint,
      method: 'GET'
    }, (res) => {
      const duration = Date.now() - start;
      stats.requests++;
      stats.totalTime += duration;
      stats.minTime = Math.min(stats.minTime, duration);
      stats.maxTime = Math.max(stats.maxTime, duration);
      
      if (res.statusCode === 200) {
        stats.success++;
      } else {
        stats.errors++;
      }
      
      resolve();
    });

    req.on('error', () => {
      stats.requests++;
      stats.errors++;
      resolve();
    });

    req.end();
  });
}

async function runLoadTest() {
  console.log('Starting load test...');
  console.log(`Duration: ${config.duration}ms`);
  console.log(`Concurrency: ${config.concurrency}`);
  console.log(`Endpoints: ${config.endpoints.join(', ')}`);
  
  const startTime = Date.now();
  const endTime = startTime + config.duration;
  
  const workers = [];
  for (let i = 0; i < config.concurrency; i++) {
    workers.push(runWorker(endTime));
  }
  
  await Promise.all(workers);
  
  printResults();
}

async function runWorker(endTime) {
  while (Date.now() < endTime) {
    const endpoint = config.endpoints[Math.floor(Math.random() * config.endpoints.length)];
    await makeRequest(endpoint);
  }
}

function printResults() {
  console.log('\n=== Load Test Results ===');
  console.log(`Total Requests: ${stats.requests}`);
  console.log(`Successful: ${stats.success}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Success Rate: ${((stats.success / stats.requests) * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${(stats.totalTime / stats.requests).toFixed(2)}ms`);
  console.log(`Min Response Time: ${stats.minTime}ms`);
  console.log(`Max Response Time: ${stats.maxTime}ms`);
  console.log(`Requests/sec: ${(stats.requests / (config.duration / 1000)).toFixed(2)}`);
}

runLoadTest().catch(console.error);
