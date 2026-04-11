const { db } = require('../config/firebase');

const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();
    
    if (doc.exists) {
      const updatedData = {
        role: req.body.role || doc.data().role,
        assignedSection: req.body.assignedSection || doc.data().assignedSection,
        updatedAt: new Date().toISOString()
      };
      await userRef.update(updatedData);
      res.json({ _id: doc.id, ...doc.data(), ...updatedData });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();
    
    if (doc.exists) {
      const user = doc.data();
      if (user.role === 'Admin' && user.email === 'zizoelsadany7@gmail.com') {
          return res.status(400).json({ message: 'Cannot delete the main admin' });
      }
      await userRef.delete();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
