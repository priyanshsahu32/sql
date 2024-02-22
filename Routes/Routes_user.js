const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Models_User = require('../models/Models_User');

const router = express.Router();

module.exports = (db) => {
  const userModel = new Models_User(db);

  // Fetch user details using JWT
  router.get('/register', async (req, resp, next) => {
    try {
      const user = await userModel.getUserByEmail(req.user.email);
      resp.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error('Error in register route:', error);  // Log the error details
      resp.status(500).json({
        success: false,
        msg: 'Server error',
      });
    }
  });

  // User registration
  router.post('/register', async (req, resp, next) => {
    const { username, email, password } = req.body;

    // Checking if user already exists
    try {
      const existingUser = await userModel.getUserByEmail(email);

      if (existingUser) {
        return resp.status(400).json({
          msg: 'User already exists',
          success: false,
        });
      }

      // Hashing password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Inserting user into MySQL
      const userId = await userModel.createUser(username, 'https://gravatar.com/avatar/?s=' + 200 + '&d=retro', email, hashedPassword);

      if (userId) {
        // Creating JWT token
        const payload = {
          user: {
            id: userId,
          },
        };

        jwt.sign(payload, process.env.jwtUserSecret, {
          expiresIn: 360000,
        }, (err, token) => {
          if (err) {
            console.error('Error in register route:', err);  // Log the error details
            return resp.status(500).json({
              msg: 'Server error',
              success: false,
            });
          }

          resp.status(200).json({
            success: true,
            token: token,
          });
        });
      } else {
        return resp.status(400).json({
          msg: 'Something went wrong',
          success: false,
        });
      }
    } catch (error) {
      console.error('Error in register route:', error);  // Log the error details
      resp.status(500).json({
        success: false,
        msg: 'Server error',
      });
    }
  });

  // User login
  router.post('/login', async (req, resp, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      // Fetching user from MySQL
      const user = await userModel.getUserByEmail(email);

      if (!user) {
        return resp.status(400).json({
          success: false,
          msg: 'User not registered! Go and register to continue.',
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return resp.status(400).json({
          success: false,
          msg: 'Wrong password!',
        });
      }

      // Creating JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtUserSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) {
            console.error('Error in login route:', err);  // Log the error details
            return resp.status(500).json({
              success: false,
              msg: 'Server error',
            });
          }

          resp.status(200).json({
            success: true,
            msg: 'User logged in successfully',
            token: token,
            user: user,
          });
        }
      );
    } catch (error) {
      console.error('Error in login route:', error);  // Log the error details
      resp.status(500).json({
        success: false,
        msg: 'Server error',
      });
    }
  });

  return router;
};
