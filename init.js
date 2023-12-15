const { credential } = require('firebase-admin');
const serviceAccount = require('./service_account.json')

const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const firebaseDB = getFirestore();
firebaseDB.settings({ ignoreUndefinedProperties: true })

module.exports = firebaseDB