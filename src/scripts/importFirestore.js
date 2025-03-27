import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Initialize Firebase Admin SDK
import serviceAccount from '../../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Get file name from command-line argument (default: 'data.json')
const fileName = process.argv[2] || 'data.json';

try {
  // Load JSON file asynchronously
  const data = JSON.parse(await readFile(fileName, 'utf8'));

  async function importData() {
    for (const [collectionName, documents] of Object.entries(data)) {
      for (const [docId, docData] of Object.entries(documents)) {
        await db.collection(collectionName).doc(docId).set(docData);
      }
    }
  }

  importData().catch(console.error);
} catch (error) {
  console.error(`❌ Error reading file: ${fileName}\n`, error);
}
