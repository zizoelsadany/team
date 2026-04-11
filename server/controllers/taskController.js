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
    let tasksRef = db.collection('tasks');
    let snapshot;

    if (req.user.role !== 'Admin') {
      snapshot = await tasksRef.where('assignedTo', 'array-contains', req.user._id).get();
    } else {
      snapshot = await tasksRef.get();
    }

    const tasks = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    const populatedTasks = await Promise.all(tasks.map(async (task) => {
      if (task.assignedTo && task.assignedTo.length > 0) {
        const userPromises = task.assignedTo.map(async (uid) => {
          const userDoc = await db.collection('users').doc(uid).get();
          return userDoc.exists ? { _id: userDoc.id, ...userDoc.data() } : { _id: uid, name: 'Unknown User' };
        });
        task.assignedTo = await Promise.all(userPromises);
      }
      return task;
    }));

    res.json(populatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const taskRef = db.collection('tasks').doc(req.params.id);
    const doc = await taskRef.get();
    if (doc.exists) {
      await taskRef.update({ status: 'Completed' });
      res.json({ _id: doc.id, ...doc.data(), status: 'Completed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const taskRef = db.collection('tasks').doc(req.params.id);
    const doc = await taskRef.get();
    if (doc.exists) {
      const task = doc.data();
      const fileData = {
        name: req.file.originalname,
        url: `uploads/${req.file.filename}`,
        status: 'Pending'
      };
      const updatedFiles = [...(task.files || []), fileData];
      await taskRef.update({ files: updatedFiles });
      res.json({ _id: doc.id, ...task, files: updatedFiles });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskRef = db.collection('tasks').doc(req.params.id);
    const doc = await taskRef.get();
    if (doc.exists) {
      await taskRef.delete();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, completeTask, uploadFile, deleteTask };
