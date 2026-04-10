require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const deleteSpecificTask = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Delete tasks with the specific title we created earlier
    const result = await Task.deleteMany({ title: 'Project Module: Student Management System' });
    
    console.log(`Successfully deleted ${result.deletedCount} tasks from the database.`);
    process.exit();
  } catch (err) {
    console.error('Error deleting task:', err);
    process.exit(1);
  }
};

deleteSpecificTask();
