const mysql = require('mysql');

module.exports = class Models_User {
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

  createUser(username, avatar, email, password) {
    const sql = 'INSERT INTO user (username, avatar, email, password) VALUES (?, ?, ?, ?)';
    const values = [username, avatar, email, password];

    return this.executeQuery(sql, values).then(result => result.insertId);
  }

  getUserByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const values = [email];

    return this.executeQuery(sql, values).then(results => results[0]);
  }

  // You might want to add more methods based on your application's requirements
};
