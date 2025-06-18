const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  static async create(full_name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (full_name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, created_at
    `;
    const { rows } = await db.query(query, [full_name, email, hashedPassword]);
    return rows[0];
  }

  static async verifyPassword(user, password) {
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User; 