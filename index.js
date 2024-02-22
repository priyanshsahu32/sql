const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'password', // Replace with your MySQL password
  database: 'college' // Replace with your MySQL database name
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // You can perform queries or other database operations here

  // Example query
  connection.query('SELECT * FROM your_table_name', (queryErr, results) => {
    if (queryErr) {
      console.error('Error executing query:', queryErr);
      return;
    }
    console.log('Query results:', results);

    // Close the connection when done
    connection.end();
  });
});
