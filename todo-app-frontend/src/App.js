import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the styles

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const handleAddTask = async () => {
    try {
      const res = await axios.post('http://localhost:5000/tasks', newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleCompleteTask = async (id, isCompleted) => {
    try {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, { isCompleted });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input 
        type="text" 
        placeholder="Title" 
        value={newTask.title} 
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
      />
      <textarea 
        placeholder="Description" 
        value={newTask.description} 
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input 
              type="checkbox" 
              checked={task.isCompleted} 
              onChange={() => handleCompleteTask(task._id, !task.isCompleted)} 
            />
            <span>{task.title}</span>
            <button onClick={() => handleUpdateTask(task._id, { ...task, title: 'Updated Task' })}>Edit</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
