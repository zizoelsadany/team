const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function syncUsers() {
  const usersPath = path.join(__dirname, 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

  console.log(`Syncing ${users.length} users to Firebase...`);

  for (const user of users) {
    const { _id, ...userData } = user;
    await db.collection('users').doc(_id).set(userData, { merge: true });
    console.log(`Synced user: ${user.name} (${user.email})`);
  }

  console.log('Firebase Sync Complete!');
  process.exit();
}

syncUsers().catch(err => {
  console.error('Error syncing users:', err);
  process.exit(1);
});
