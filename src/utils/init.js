import firebaseAdmin from 'firebase-admin';
import serviceAccount from '../../service_account.json' assert { type: 'json' };

const app = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const firebaseDB = firebaseAdmin.firestore();
firebaseDB.settings({ ignoreUndefinedProperties: true });

export const firestoreDB = firebaseDB;