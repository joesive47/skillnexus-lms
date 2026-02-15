// Test password verification
const bcrypt = require('bcryptjs');

const password = 'student@123!';
const hash = '$2a$12$dQthBZimvjDMqPiN8PzKVO6R0MjavNaKXWPgyeu5TVlF70v2Aqd9i';

console.log('Testing password verification...');
console.log('Password:', password);
console.log('Hash:', hash);

bcrypt.compare(password, hash).then(result => {
  console.log('\nResult:', result);
  if (result) {
    console.log('✅ Password matches!');
  } else {
    console.log('❌ Password does NOT match!');
    console.log('\nTrying to generate new hash...');
    bcrypt.hash(password, 12).then(newHash => {
      console.log('New hash:', newHash);
      console.log('\nComparing with new hash...');
      bcrypt.compare(password, newHash).then(newResult => {
        console.log('New result:', newResult);
      });
    });
  }
}).catch(err => {
  console.error('Error:', err);
});
