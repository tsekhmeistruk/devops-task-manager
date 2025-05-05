const Task = require('../../task.model');

jest.mock('../../task.model');

describe('Task Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Task.save() and return the saved object', async () => {
    const mockSave = jest.fn().mockResolvedValue({ title: 'Unit Task', done: false });

    Task.mockImplementation(() => ({
      save: mockSave,
    }));

    const taskData = { title: 'Unit Task' };
    const task = new Task(taskData);
    const result = await task.save();

    expect(mockSave).toHaveBeenCalled();
    expect(result.title).toBe('Unit Task');
    expect(result.done).toBe(false);
  });

  it('should call Task.find() and return an array', async () => {
    const mockFind = jest.fn().mockResolvedValue([{ title: 'A task' }]);
    Task.find = mockFind;

    const result = await Task.find();

    expect(Task.find).toHaveBeenCalled();
    expect(result).toEqual([{ title: 'A task' }]);
  });
});
