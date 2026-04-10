require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'zizoelsadany7@gmail.com';
    
    let user = await User.findOne({ email });
    if (!user) {
      await User.create({
        name: 'Admin User',
        email: email,
        role: 'Admin',
        assignedSection: 'None'
      });
      console.log('Admin user created successfully!');
    } else {
      user.role = 'Admin';
      await user.save();
      console.log('User already exists, updated to Admin.');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
