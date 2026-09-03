#!/usr/bin/env node

// Simple console colors without chalk
const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;
const bold = (text) => `${colors.bold}${text}${colors.reset}`;

console.log('\n' + '='.repeat(60));
console.log(c('green', bold('🎉 BUILD SUCCESSFUL! 🎉')));
console.log('='.repeat(60));

console.log('\n📋 ' + c('cyan', bold('TESTING URLS:')));
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ ' + c('yellow', bold('🏠 Homepage:')) + '        http://localhost:3000           │');
console.log('│ ' + c('blue', bold('🔐 Login:')) + '           http://localhost:3000/login      │');
console.log('│ ' + c('green', bold('📊 Dashboard:')) + '       http://localhost:3000/dashboard   │');
console.log('│ ' + c('purple', bold('🎯 Assessment:')) + '      http://localhost:3000/skills-assessment │');
console.log('│ ' + c('red', bold('⚙️  Admin:')) + '           http://localhost:3000/admin      │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('\n🧪 ' + c('cyan', bold('TEST ACCOUNTS:')));
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│ ' + c('yellow', 'Admin:') + '   admin@skillnexus.com / Admin@123!     │');
console.log('│ ' + c('blue', 'Teacher:') + ' teacher@skillnexus.com / Teacher@123!  │');
console.log('│ ' + c('green', 'Student:') + ' student@skillnexus.com / Student@123!  │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('\n🚀 ' + c('magenta', bold('QUICK START:')));
console.log('   ' + c('white', 'npm run dev') + c('gray', ' - Start development server'));
console.log('   ' + c('white', 'npm start') + c('gray', '   - Start production server'));

console.log('\n' + c('green', '✅ Ready to test your SkillNexus LMS!'));
console.log('='.repeat(60) + '\n');