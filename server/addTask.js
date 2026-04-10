require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const addTaskForEveryone = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const users = await User.find({});
    const userIds = users.filter(u => u.role !== 'Admin').map(u => u._id);

    const taskDescription = `
🎯 Standard Naming - Student Management System
👨🎓 Student Class
- int studentId;
- String studentName;
- String studentMajor;
- ArrayList<Subject> subjects;

📚 Subject Class
- String subjectName;
- int creditHours;
- double grade;

🧠 StudentManagementSystem Class
- ArrayList<Student> students;

🔥 Function Names:
📌 Student: addSubject(Subject subject), calculateGPA(), displayStudentInfo()
📌 StudentManagementSystem: addStudent(Student student), searchStudent(int studentId), addSubjectToStudent(int studentId, Subject subject)

⚠️ Important:
- Use camelCase
- grade should be double
- ArrayList names: subjects & students
    `;

    const newTask = new Task({
      title: 'Project Module: Student Management System',
      description: taskDescription.trim(),
      assignedTo: userIds,
      section: 'Backend',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'Pending'
    });

    await newTask.save();
    console.log('Task added and assigned to everyone successfully!');
    process.exit();
  } catch (err) {
    console.error('Error adding task:', err);
    process.exit(1);
  }
};

addTaskForEveryone();
