const { collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query, where } = require('firebase/firestore');

const { hashPassword, compareHash } = require('./hash.js');

const { getRandomColor, isHexColor, userSignedIn, userNotSignedIn } = require('./script.js');

async function signin(db, username, password) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length === 0) {
    return userNotSignedIn();
  }

  const user = usersList[0];
  const check = await compareHash(password, user.password);
  if (check) {
    return userSignedIn(user.id, user.username, user.email, user.createdAt, user.isCertified, user.section, user.color, user.image);
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
    const section = null;
    const color = getRandomColor();
    const image = null;
    await addDoc(usersCollection, {
      id: id,
      username: username,
      email: email,
      password: hash,
      createdAt: createdAt,
      isCertified: isCertified,
      section: section,
      color: color,
      image: image
    });
    return userSignedIn(id, username, email, createdAt, isCertified, section, color, image);
  } catch (error) {
    return userNotSignedIn();
  }
}

async function changeImage(db, username, newImage) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { image: newImage });

  return true;
}

async function changeColor(db, username, newColor) {
  if (!isHexColor(newColor)) {
    return false;
  }

  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { color: newColor });

  return true;
}

async function changeUsername(db, username, newUsername) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { username: newUsername });

  return true;
}

async function changeEmail(db, username, newEmail) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { email: newEmail });

  return true;
}

async function changePassword(db, username, password, newPassword) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length === 0) {
    return false;
  }

  const user = usersList[0];
  const check = await compareHash(password, user.password);
  if (!check) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);

  const userDoc = usersSnapshot.docs[0];
  await updateDoc(userDoc.ref, { password: hashedPassword });

  return true;
}

async function deleteAccount(db, username) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs;

  if (usersList.length === 0) {
    return { success: false, message: "Utilisateur non trouvé." };
  }

  try {
    await Promise.all(usersList.map(userDoc => deleteDoc(userDoc.ref)));
    return { success: true, message: "Compte supprimé avec succès." };
  } catch (error) {
    return { success: false, message: "Erreur lors de la suppression du compte." };
  }
}

async function certify(db, username, email) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { email, isCertified: true });

  return true;
}

async function getUserInfo(db, id) {
  const usersCollection = collection(db, 'users');
  const findUserById = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUserById);
  const usersList = usersSnapshot.docs.map(doc => doc.data());
  const user = usersList[0];

  const userInfo = {
    username: user.username,
    isCertified: user.isCertified,
    color: user.color,
    image: user.image
  };

  if (usersList.length > 0) {
    return userInfo;
  } else {
    return null;
  }
}

module.exports = { signin, signup, changeImage, changeColor, changeUsername, changeEmail, changePassword, deleteAccount, certify, getUserInfo };