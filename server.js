const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const connectDB = require('./config/db'); // Assuming you've modified connectDB to return a MySQL connection
const dotenv = require('dotenv');
const userRoutes = require('./Routes/Routes_user');
const todoRoutes = require('./Routes/Routes_Todo');

const app = express();

app.use(morgan('dev'));
app.use(express.json({ extended: true }));
dotenv.config({ path: './config/config.env' });

// Create a MySQL connection
const db = connectDB();


// Pass the MySQL connection to your routes
app.use('/api/todo/auth', userRoutes(db));
app.use('/api/todo', todoRoutes(db));

// const PORT = process.env.PORT || 3000;
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
