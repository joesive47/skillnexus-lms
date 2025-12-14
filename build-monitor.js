const { performance } = require('perf_hooks');
const fs = require('fs');

const startTime = performance.now();

console.log('📊 Build Performance Monitor');
console.log('⏱️  Build started at:', new Date().toISOString());

process.on('exit', () => {
  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  const stats = {
    buildTime: duration + 's',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  };
  
  console.log('✅ Build completed in:', duration + 's');
  
  fs.writeFileSync('.next/build-stats.json', JSON.stringify(stats, null, 2));
});