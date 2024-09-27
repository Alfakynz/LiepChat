const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, query, where } = require('firebase/firestore');
require('dotenv').config();

const { hashPassword, compareHash } = require('./hash.js');

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

async function signin(db, username, password) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  // Vérifier l'username
  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  // Aucun utilisateur trouvé
  if (usersList.length === 0) {
    return false;
  }

  // Vérification du mot de passe
  const user = usersList[0];
  const check = await compareHash(password, user.password);
  if (check) {
    return true;
  } else {
    return false;
  }
}

async function signup(db, username, password, confirmPassword) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  if (password !== confirmPassword) {
    return false;
  }

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length > 0) {
    return false;
  }

  try {
    const hash = await hashPassword(password);
    await addDoc(usersCollection, { username, password: hash });
    const user = {
      isSignedIn: true,
      name: username
    };
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { db, getCollection, signin, signup };