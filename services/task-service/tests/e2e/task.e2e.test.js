const axios = require('axios');

describe('E2E: Task API', () => {
  const BASE_URL = global.BASE_URL

  it('should create a task via API', async () => {
    const response = await axios.post(`${BASE_URL}/tasks`, {
      title: 'E2E Task',
      description: 'This is an E2E test'
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('_id');
    expect(response.data.title).toBe('E2E Task');
  });

  it('should fetch all tasks', async () => {
    const response = await axios.get(`${BASE_URL}/tasks`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
