const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query, where } = require('firebase/firestore');
require('dotenv').config();

const { hashPassword, compareHash } = require('./hash.js');
const { getRandomColor, isHexColor, userSignedIn, userNotSignedIn } = require('./script.js')

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
    return userNotSignedIn();
  }

  // Vérification du mot de passe
  const user = usersList[0];
  const check = await compareHash(password, user.password);
  if (check) {
    return userSignedIn(user.id, user.username, user.email, user.createdAt, user.isCertified, user.color);
  } else {
    return userNotSignedIn();
  }
}

async function signup(db, username, password, confirmPassword, id) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  if (password !== confirmPassword) {
    return userNotSignedIn();
  }

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length > 0) {
    return userNotSignedIn();
  }

  try {
    const hash = await hashPassword(password);
    const email = null;
    const createdAt = new Date();
    const isCertified = false;
    const color = getRandomColor();
    await addDoc(usersCollection, {
      id: id,
      username: username,
      email: email,
      password: hash,
      createdAt: createdAt,
      isCertified: isCertified,
      color: color
    });
    return userSignedIn(id, username, email, createdAt, isCertified, color);
  } catch (error) {
    return userNotSignedIn();
  }
}

async function changeColor(db, username, newColor) {
  if (!isHexColor(newColor)) {
    return false;
  }

  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  // Vérifier l'username
  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  // Aucun utilisateur trouvé
  if (usersList.length === 0) {
    return false;
  }

  // Mettre à jour la couleur
  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { color: newColor });

  return true;
}

async function changeUsername(db, username, newUsername) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  // Vérifier l'username
  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  // Aucun utilisateur trouvé
  if (usersList.length === 0) {
    return false;
  }

  // Mettre à jour le nom d'utilisateur
  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { username: newUsername });

  return true;
}

async function changePassword(db, username, password, newPassword) {
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
  if (!check) {
    return false;
  }

  // Hash du nouveau mot de passe
  const hashedPassword = await hashPassword(newPassword);

  // Mettre à jour le mot de passe dans Firestore
  const userDoc = usersSnapshot.docs[0];
  await updateDoc(userDoc.ref, { password: hashedPassword });

  return true;
}

async function deleteAccount(db, username) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  // Vérifier l'existence de l'utilisateur
  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Aucun utilisateur trouvé
  if (usersList.length === 0) {
    return false;
  }

  // Récupérer l'ID du document à supprimer
  const userDocId = usersList[0].id;

  // Suppression de l'utilisateur
  await deleteDoc(doc(db, 'users', userDocId));

  return true;
}

module.exports = { db, getCollection, signin, signup, changeColor, changeUsername, changePassword, deleteAccount };