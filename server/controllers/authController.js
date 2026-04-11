const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const loginEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const userDoc = snapshot.docs[0];
    const user = { _id: userDoc.id, ...userDoc.data() };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginEmail };
