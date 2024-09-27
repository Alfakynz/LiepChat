const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function compareHash(password, hash) {
  const check = await bcrypt.compare(password, hash);
  return check;
}

module.exports = { hashPassword, compareHash }