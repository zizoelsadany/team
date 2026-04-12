const mockDb = require('../config/mockDb');

const createTask = async (req, res) => {
  const { title, description, assignedTo, section, deadline } = req.body;
  try {
    const taskData = {
      title,
      description,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [assignedTo],
      section,
      deadline,
      createdAt: new Date().toISOString()
    };
    const newTask = mockDb.tasks.create(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role !== 'Admin') {
      tasks = mockDb.tasks.find({ assignedTo: req.user._id });
    } else {
      tasks = mockDb.tasks.find();
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = mockDb.tasks.findById(req.params.id);
    if (task) {
      task.status = 'Completed';
      const updatedTask = mockDb.tasks.save(task);
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, name } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Cloudinary URL is required' });
    }

    const task = mockDb.tasks.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const fileData = {
      name: name || 'Uploaded File',
      url: url,
      uploadedAt: new Date().toISOString(),
      status: 'Pending'
    };

    task.files = [...(task.files || []), fileData];
    const updatedTask = mockDb.tasks.save(task);

    res.json(updatedTask);
  } catch (error) {
    console.error('Server Upload Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error during file save',
      details: error.message 
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = mockDb.tasks.findById(req.params.id);
    if (task) {
      mockDb.tasks.delete(req.params.id);
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, completeTask, uploadFile, deleteTask };
