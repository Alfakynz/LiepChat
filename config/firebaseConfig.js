const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

const apiKey = process.env['apiKey'];
const authDomain = process.env['authDomain'];
const projectId = process.env['projectId'];
const storageBucket = process.env['storageBucket'];
const messagingSenderId = process.env['messagingSenderId'];
const appId = process.env['appId'];
const measurementId = process.env['measurementId'];

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getCollection(db, col) {
  const docCollection = collection(db, col);
  const collectionSnapshot = await getDocs(docCollection);
  const collectionList = collectionSnapshot.docs.map(doc => doc.data());
  return collectionList;
}

module.exports = { db, getCollection };