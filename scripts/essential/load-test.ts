/**
 * Phase 8: Load Testing Script
 * Simulate 100K concurrent users
 */

import { monitoringService } from '../../src/lib/performance/monitoring-service';

interface LoadTestConfig {
  targetUrl: string;
  concurrentUsers: number;
  duration: number;
  rampUp: number;
}

async function runLoadTest(config: LoadTestConfig) {
  console.log('🚀 Starting Load Test...\n');
  console.log(`Target: ${config.targetUrl}`);
  console.log(`Users: ${config.concurrentUsers}`);
  console.log(`Duration: ${config.duration}s`);
  console.log(`Ramp-up: ${config.rampUp}s\n`);

  const results = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalResponseTime: 0,
    minResponseTime: Infinity,
    maxResponseTime: 0,
  };

  const startTime = Date.now();
  const endTime = startTime + config.duration * 1000;
  const usersPerSecond = config.concurrentUsers / config.rampUp;

  let activeUsers = 0;

  const interval = setInterval(async () => {
    if (Date.now() >= endTime) {
      clearInterval(interval);
      printResults(results, config.duration);
      return;
    }

    if (activeUsers < config.concurrentUsers) {
      activeUsers += usersPerSecond;
    }

    for (let i = 0; i < Math.floor(activeUsers); i++) {
      makeRequest(config.targetUrl, results);
    }
  }, 1000);
}

async function makeRequest(url: string, results: any) {
  const start = Date.now();
  
  try {
    const response = await fetch(url);
    const responseTime = Date.now() - start;
    
    results.totalRequests++;
    results.totalResponseTime += responseTime;
    results.minResponseTime = Math.min(results.minResponseTime, responseTime);
    results.maxResponseTime = Math.max(results.maxResponseTime, responseTime);
    
    if (response.ok) {
      results.successfulRequests++;
      monitoringService.recordMetric('responseTime', responseTime);
    } else {
      results.failedRequests++;
      monitoringService.recordMetric('error', 1);
    }
  } catch (error) {
    results.failedRequests++;
    monitoringService.recordMetric('error', 1);
  }
}

function printResults(results: any, duration: number) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 LOAD TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`\nTotal Requests: ${results.totalRequests}`);
  console.log(`Successful: ${results.successfulRequests} (${((results.successfulRequests / results.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`Failed: ${results.failedRequests} (${((results.failedRequests / results.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`\nResponse Times:`);
  console.log(`  Average: ${(results.totalResponseTime / results.totalRequests).toFixed(2)}ms`);
  console.log(`  Min: ${results.minResponseTime}ms`);
  console.log(`  Max: ${results.maxResponseTime}ms`);
  console.log(`\nThroughput: ${(results.totalRequests / duration).toFixed(2)} req/s`);
  console.log('\n' + '='.repeat(60));
  
  const stats = monitoringService.getStats();
  console.log('\n📈 Monitoring Stats:');
  console.log(`  Total Metrics: ${stats.totalMetrics}`);
  console.log(`  Total Alerts: ${stats.totalAlerts}`);
  console.log(`  Critical Alerts: ${stats.criticalAlerts}`);
  console.log(`  Avg Response Time: ${stats.avgResponseTime.toFixed(2)}ms`);
  console.log(`  Error Rate: ${stats.errorRate.toFixed(2)}/min`);
}

const config: LoadTestConfig = {
  targetUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  concurrentUsers: parseInt(process.env.LOAD_TEST_USERS || '1000'),
  duration: parseInt(process.env.LOAD_TEST_DURATION || '60'),
  rampUp: parseInt(process.env.LOAD_TEST_RAMPUP || '10'),
};

runLoadTest(config).catch(console.error);
