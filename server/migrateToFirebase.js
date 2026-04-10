const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. Get your service account key from Firebase Console:
// Project Settings -> Service Accounts -> Generate new private key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const migrateData = async () => {
  try {
    console.log('Starting migration to Firebase Firestore...');

    const usersPath = path.join(__dirname, 'data/users.json');
    const tasksPath = path.join(__dirname, 'data/tasks.json');

    // 1. Migrate Users
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      console.log(`Found ${users.length} users. Uploading...`);
      
      for (const user of users) {
        // We use the email or original _id as the document ID to keep it consistent
        const docId = user._id || user.email;
        await db.collection('users').doc(docId).set({
          ...user,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
      console.log('✅ Users migrated successfully.');
    }

    // 2. Migrate Tasks
    if (fs.existsSync(tasksPath)) {
      const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
      console.log(`Found ${tasks.length} tasks. Uploading...`);

      for (const task of tasks) {
        // Use original _id as doc ID if it exists
        const docId = task._id || db.collection('tasks').doc().id;
        await db.collection('tasks').doc(docId).set({
          ...task,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
      console.log('✅ Tasks migrated successfully.');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
