const { db } = require('../config/firebase');

const createTask = async (req, res) => {
  const { title, description, assignedTo, section, deadline } = req.body;
  try {
    const taskData = {
      title,
      description,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [assignedTo],
      section,
      deadline,
      status: 'Pending',
      files: [],
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('tasks').add(taskData);
    res.status(201).json({ _id: docRef.id, ...taskData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').get();
    let tasks = tasksSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    if (req.user.role !== 'Admin') {
      tasks = tasks.filter(t => t.assignedTo.includes(req.user._id));
    }
    
    // Populate users (Optional but recommended for UI consistency)
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    
    tasks = tasks.map(t => ({
      ...t,
      assignedTo: t.assignedTo.map(id => users.find(u => u._id === id) || id)
    }));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const taskRef = db.collection('tasks').doc(req.params.id);
    const task = await taskRef.get();
    if (task.exists) {
      await taskRef.update({ status: 'Completed' });
      res.json({ _id: task.id, ...task.data(), status: 'Completed' });
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

    if (!url) return res.status(400).json({ message: 'URL is required' });

    const taskRef = db.collection('tasks').doc(id);
    const task = await taskRef.get();

    if (task.exists) {
      const existingFiles = task.data().files || [];
      const fileData = {
        name: name || 'Uploaded File',
        url: url,
        uploadedAt: new Date().toISOString(),
        status: 'Pending'
      };
      
      await taskRef.update({
        files: [...existingFiles, fileData]
      });
      
      res.json({ message: 'File uploaded and saved to Firebase' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Firebase Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await db.collection('tasks').doc(req.params.id).delete();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, completeTask, uploadFile, deleteTask };
