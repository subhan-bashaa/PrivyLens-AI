import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

export default {
  hashPassword,
  comparePassword,
};
