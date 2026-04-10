const Task = require('../models/Task');

const createTask = async (req, res) => {
  const { title, description, assignedTo, section, deadline } = req.body;
  try {
    const task = await Task.create({
      title, description, assignedTo, section, deadline
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  let query = {};
  if (req.user.role !== 'Admin') {
    query.assignedTo = req.user._id;
  }
  try {
    const tasks = await Task.find(query).populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.status = 'Completed';
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      const fileData = {
        name: req.file.originalname,
        url: req.file.path,
        status: 'Pending'
      };
      task.files.push(fileData);
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, completeTask, uploadFile, deleteTask };
