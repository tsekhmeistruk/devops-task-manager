const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/tasks', (req, res) => {
  res.json([{ id: 1, title: 'Sample Task', done: false }]);
});

app.listen(PORT, () => {
  console.log(`Task service running at http://localhost:${PORT}`);
});
