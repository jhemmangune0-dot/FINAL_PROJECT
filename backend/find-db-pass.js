const mysql = require('mysql2/promise');

const passwordsToTry = [
  '',
  'root',
  'password',
  '1234',
  '12345',
  '123456',
  '12345678',
  'admin',
  'admin123',
  'root123',
  'joyma',
  'Joyma',
  'joyma123',
  'joy123',
  'student',
  'student123'
];

async function tryPasswords() {
  console.log("Starting to guess MySQL root password...");
  for (const pwd of passwordsToTry) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pwd,
        connectTimeout: 2000
      });
      console.log(`SUCCESS! The password is: "${pwd}"`);
      await connection.end();
      return pwd;
    } catch (err) {
      if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        // Incorrect password, continue
      } else {
        console.error(`Error with password "${pwd}":`, err.message);
      }
    }
  }
  console.log("FAILED to guess the password.");
  return null;
}

tryPasswords();
