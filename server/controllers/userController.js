const mockDb = require('../config/mockDb');

const getUsers = async (req, res) => {
  try {
    const users = mockDb.users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = mockDb.users.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      user.assignedSection = req.body.assignedSection || user.assignedSection;
      user.updatedAt = new Date().toISOString();

      const updatedUser = mockDb.users.save(user);
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = mockDb.users.findById(req.params.id);

    if (user) {
      if (user.role === 'Admin' && user.email === 'zizoelsadany7@gmail.com') {
        return res.status(400).json({ message: 'Cannot delete the main admin' });
      }
      mockDb.users.delete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
