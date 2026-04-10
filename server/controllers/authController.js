const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginEmail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Create user if not found
      user = await User.create({
        name: email.split('@')[0],
        email: email,
        role: 'Team Member',
        assignedSection: 'None',
        picture: 'https://via.placeholder.com/150'
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
