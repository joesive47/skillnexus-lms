const { execSync } = require('child_process');

console.log('🔍 Starting build with debug info...\n');

try {
  execSync('next build --debug', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=8192',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
