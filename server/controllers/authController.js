const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(403).json({
        message: 'Access Denied: This email is not authorized to access this dashboard.'
      });
    }

    const userDoc = snapshot.docs[0];
    const user = { _id: userDoc.id, ...userDoc.data() };

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authSuccess = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/login`);
};

module.exports = { authSuccess, loginEmail };
