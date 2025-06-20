const db = require('../config/db');

class Todo {
  static async findByUserId(userId, limit = null) {
    let query = `
      SELECT * FROM todos 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    if (limit) {
      query += ` LIMIT $2`;
      const { rows } = await db.query(query, [userId, limit]);
      return rows;
    } else {
      const { rows } = await db.query(query, [userId]);
      return rows;
    }
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM todos WHERE id = $1 AND user_id = $2';
    const { rows } = await db.query(query, [id, userId]);
    return rows[0];
  }

  static async create(userId, title, description = '') {
    const query = `
      INSERT INTO todos (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, title, description, completed, created_at, updated_at
    `;
    const { rows } = await db.query(query, [userId, title, description]);
    return rows[0];
  }

  static async update(id, userId, updates) {
    const { title, description, completed } = updates;
    const query = `
      UPDATE todos 
      SET title = COALESCE($3, title),
          description = COALESCE($4, description),
          completed = COALESCE($5, completed),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, title, description, completed, created_at, updated_at
    `;
    const { rows } = await db.query(query, [id, userId, title, description, completed]);
    return rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id';
    const { rows } = await db.query(query, [id, userId]);
    return rows[0];
  }

  static async toggleComplete(id, userId) {
    const query = `
      UPDATE todos 
      SET completed = NOT completed,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, title, description, completed, created_at, updated_at
    `;
    const { rows } = await db.query(query, [id, userId]);
    return rows[0];
  }
}

module.exports = Todo; 