import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks')
      setTasks(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return
    try {
      await axios.post('/tasks', { title: newTask })
      setNewTask('')
      fetchTasks()
    } catch (err) {
      console.error('Add task error:', err)
    }
  }

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const toggleDone = async (task) => {
    await axios.put(`/tasks/${task._id}`, { done: !task.done })
    fetchTasks()
  }

  const updateTaskTitle = async (task, newTitle) => {
    await axios.put(`/tasks/${task._id}`, { title: newTitle })
    fetchTasks()
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="task-input">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className={`task ${task.done ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task)}
            />
            <input
              className="editable"
              value={task.title}
              onChange={e => updateTaskTitle(task, e.target.value)}
            />
            <button onClick={() => deleteTask(task._id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
