// hashPassword.js
const bcrypt = require('bcrypt');

const password = '1234';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log(hash); // This hash will be used in the users array
});
