const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../../task.model');

const MONGODB_URI = global.MONGODB_URI;

const app = express();
app.use(express.json());

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /tasks (Integration)', () => {
  it('should create a task and return it', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Integration Task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Integration Task');
    expect(res.body.done).toBe(false);
  });
});
