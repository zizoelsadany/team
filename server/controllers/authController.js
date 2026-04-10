const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(403).json({ 
        message: 'Access Denied: This email is not authorized to access this dashboard.' 
      });
    }

    const userData = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id;
    
    // Add _id to match previous front-end expectation if needed
    const user = { ...userData, _id: userId };
    
    const token = generateToken(userId);
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
