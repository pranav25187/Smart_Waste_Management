const db = require('../config/db');

class User {
  static async create({ name, email, password, mobile_no, address }) {
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, mobile_no, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, mobile_no, address]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User;