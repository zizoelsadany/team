require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Task = require('./models/Task');

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    const usersPath = path.join(__dirname, 'data/users.json');
    const tasksPath = path.join(__dirname, 'data/tasks.json');

    // Migrate Users
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      for (const u of users) {
        // Remove existing IDs if they are local numbers
        const { _id, ...userData } = u;
        await User.findOneAndUpdate(
          { email: u.email },
          userData,
          { upsert: true, new: true }
        );
      }
      console.log('Users migrated successfully.');
    }

    // Migrate Tasks
    if (fs.existsSync(tasksPath)) {
      const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
      const dbUsers = await User.find();
      
      for (const t of tasks) {
        const { _id, assignedTo, ...taskData } = t;
        
        // Map old user IDs to new Mongo ObjectIDs
        const assignedIds = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
        const newAssignedTo = [];
        
        for (const oldId of assignedIds) {
          // Find user by name or email from original JSON logic
          const originalUsers = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
          const oldUser = originalUsers.find(ou => ou._id === oldId);
          if (oldUser) {
            const dbUser = dbUsers.find(du => du.email === oldUser.email);
            if (dbUser) newAssignedTo.push(dbUser._id);
          }
        }

        await Task.create({
          ...taskData,
          assignedTo: newAssignedTo
        });
      }
      console.log('Tasks migrated successfully.');
    }

    console.log('Migration complete!');
    process.exit();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateData();
