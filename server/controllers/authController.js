const jwt = require('jsonwebtoken');
const mockDb = require('../config/mockDb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = mockDb.users.findOne({ email });
    
    if (!user) {
      return res.status(403).json({ 
        message: 'Access Denied: This email is not authorized to access this dashboard.' 
      });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authSuccess = (req, res) => {
  // Not used in mock but kept for structure
  res.redirect(`${process.env.CLIENT_URL}/login`);
};

module.exports = { authSuccess, loginEmail };
