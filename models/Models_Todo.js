const mysql = require('mysql');

module.exports = class Models_Todo {
  constructor() {
    this.pool = mysql.createPool({
      host: 'roundhouse.proxy.rlwy.net',
      user: 'root',
      password: 'password',
      database: 'college',
    });
  }

  async executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.query(sql, values, (queryError, results) => {
          connection.release();

          if (queryError) {
            reject(queryError);
          } else {
            resolve(results);
          }
        });
      });
    });
  }

  createTodo(title, description, userId) {
    const sql = 'INSERT INTO todo (title, description, user) VALUES (?, ?, ?)';
    const values = [title, description, userId];

    return this.executeQuery(sql, values).then(result => result.insertId);
  }

  getTodos(userId, finished) {
    const sql = 'SELECT * FROM todo WHERE user = ? AND finished = ?';
    const values = [userId, finished];

    return this.executeQuery(sql, values);
  }

  updateTodo(todoId, updatedData) {
    const sql = 'UPDATE todo SET title = ?, description = ? WHERE id = ?';
    const values = [updatedData.title, updatedData.description, todoId];

    return this.executeQuery(sql, values).then(result => result.affectedRows);
  }

  deleteTodo(todoId) {
    const sql = 'DELETE FROM todo WHERE id = ?';
    const values = [todoId];

    return this.executeQuery(sql, values).then(result => result.affectedRows);
  }
};
