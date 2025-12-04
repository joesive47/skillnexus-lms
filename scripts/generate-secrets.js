import crypto from 'crypto';

console.log('\n🔐 Generated Secrets for Production\n');
console.log('Copy these to Vercel Environment Variables:\n');
console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('AUTH_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('CERT_SIGNING_KEY=' + crypto.randomBytes(32).toString('base64'));
console.log('\n✅ Done!\n');
