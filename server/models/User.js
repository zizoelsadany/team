const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  picture: { type: String, default: 'https://via.placeholder.com/150' },
  role: { 
    type: String, 
    enum: ['Admin', 'Team Member'], 
    default: 'Team Member' 
  },
  assignedSection: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'UI', 'Testing', 'None'], 
    default: 'None' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
