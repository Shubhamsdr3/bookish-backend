import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import firebaseAdmin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, '../../service_account.json'), 'utf8')
);

const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const firebaseDB = firebaseAdmin.firestore();
firebaseDB.settings({ ignoreUndefinedProperties: true });

export const firestoreDB = firebaseDB;