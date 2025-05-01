if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const Task = require('./task.model');
const validateEnv = require('./validateEnv');
const { body, param, validationResult } = require('express-validator');

validateEnv();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/tasks/:id',
  param('id').isMongoId().withMessage('Invalid task ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: 'Invalid Task ID' });
    }
  }
);

app.post('/tasks',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description } = req.body;
      const task = new Task({ title, description });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

app.put('/tasks/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('done').optional().isBoolean().withMessage('Done must be true or false')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, done } = req.body;
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (done !== undefined) task.done = done;

      await task.save();
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

app.delete('/tasks/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Task service running at http://localhost:${PORT}`);
});
