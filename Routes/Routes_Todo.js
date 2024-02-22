const express = require('express');
const auth = require('../middleware/user_jwt');

const router = express.Router();

module.exports = (db) => {
  // Create new todo task
  router.post('/', auth, async (req, resp, next) => {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;

      // Example MySQL query to insert a new todo
      const result = await db.executeQuery('INSERT INTO todo (title, description, user) VALUES (?, ?, ?)', [title, description, userId]);

      if (!result.insertId) {
        return resp.status(400).json({
          success: false,
          msg: 'Something went wrong',
        });
      }

      resp.status(200).json({
        success: true,
        Todo: { id: result.insertId, title, description, user: userId },
        msg: 'Successfully Created',
      });
    } catch (error) {
      next(error);
    }
  });

  // Fetch all todos
  router.get('/', auth, async (req, resp, next) => {
    try {
      const userId = req.user.id;

      // Example MySQL query to fetch todos
      const todos = await db.executeQuery('SELECT * FROM todo WHERE user = ? AND finished = ?', [userId, false]);

      if (!todos.length) {
        return resp.status(400).json({
          success: false,
          msg: 'Something error',
        });
      }

      resp.status(200).json({
        success: true,
        todos,
        msg: 'Successfully fetched',
      });
    } catch (error) {
      next(error);
    }
  });

  // Update a todo
  router.put('/:id', async (req, resp, next) => {
    try {
      const todoId = req.params.id;

      // Example MySQL query to update a todo
      const result = await db.executeQuery('UPDATE todo SET title = ?, description = ? WHERE id = ?', [req.body.title, req.body.description, todoId]);

      if (result.affectedRows === 0) {
        return resp.status(400).json({
          success: false,
          msg: 'Task Todo not exists',
        });
      }

      resp.status(200).json({
        success: true,
        msg: 'Successfully Updated',
      });
    } catch (error) {
      next(error);
    }
  });

  // Delete a todo
  router.delete('/:id', async (req, resp, next) => {
    try {
      const todoId = req.params.id;

      // Example MySQL query to delete a todo
      const result = await db.executeQuery('DELETE FROM todo WHERE id = ?', [todoId]);

      if (result.affectedRows === 0) {
        return resp.status(400).json({
          success: false,
          msg: 'Task Todo not exists',
        });
      }

      resp.status(200).json({
        success: true,
        msg: 'Successfully Deleted Task',
      });
    } catch (error) {
      next(error);
    }
  });

  // Fetch finished todos
  router.get('/finished', auth, async (req, resp, next) => {
    try {
      const userId = req.user.id;

      // Example MySQL query to fetch finished todos
      const todos = await db.executeQuery('SELECT * FROM todo WHERE user = ? AND finished = ?', [userId, true]);

      if (!todos.length) {
        return resp.status(400).json({
          success: false,
          msg: 'Something error',
        });
      }

      resp.status(200).json({
        success: true,
        todos,
        msg: 'Successfully fetched',
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
