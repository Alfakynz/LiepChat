const { collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query, where } = require('firebase/firestore');

const { hashPassword, compareHash } = require('./hash.js');

const { getRandomColor, isHexColor, userSignedIn, userNotSignedIn } = require('./script.js');

async function signin(db, username, password) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length === 0) {
    return userNotSignedIn("userDoNotExist", username);
  }

  const user = usersList[0];
  const check = await compareHash(password, user.password);
  if (check) {
    return userSignedIn(user.id, user.username, user.email, user.createdAt, user.isCertified, user.section, user.color, user.image);
  } else {
    return userNotSignedIn("badPassword", username);
  }
}

async function signup(db, username, password, confirmPassword, id) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("username", "==", username));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length > 0) {
    return userNotSignedIn("userAlreadyExist", username);
  }
  else if (username === "" || password === "") {
    return userNotSignedIn("usernameOrPassNull", username);
  }
  else if (password.length < 8) {
    return userNotSignedIn("passwordTooShort", username);
  }
  else if (password !== confirmPassword) {
    return userNotSignedIn("passwordDoNotMatch", username);
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
    return userNotSignedIn("error", username);
  }
}

async function refreshSignin(db, id) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length === 0) {
    return userNotSignedIn("userDoNotExist", "");
  }

  const user = usersList[0];
  return userSignedIn(user.id, user.username, user.email, user.createdAt, user.isCertified, user.section, user.color, user.image);
}

async function changeImage(db, id, newImage) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { image: newImage });

  return true;
}

async function changeColor(db, id, newColor) {
  if (!isHexColor(newColor)) {
    return false;
  }

  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { color: newColor });

  return true;
}

async function changeUsername(db, id, newUsername) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  const usernameExistsQuery = query(usersCollection, where("username", "==", newUsername));
  const usernameExistsSnapshot = await getDocs(usernameExistsQuery);

  if (!usernameExistsSnapshot.empty) {
    return false; // Le username est déjà utilisé
  }


  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { username: newUsername });

  return true;
}

async function changeEmail(db, id, newEmail) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc);

  if (usersList.length === 0) {
    return false;
  }

  const userDoc = usersList[0];
  await updateDoc(userDoc.ref, { email: newEmail });

  return true;
}

async function changePassword(db, id, oldPassword, newPassword, confirmPassword) {
  const usersCollection = collection(db, 'users');
  const findUser = query(usersCollection, where("id", "==", id));

  const usersSnapshot = await getDocs(findUser);
  const usersList = usersSnapshot.docs.map(doc => doc.data());

  if (usersList.length === 0) {
    return false;
  }
  else if (newPassword.length < 8) {
    return false;
  }
  else if (newPassword !== confirmPassword) {
    return false;
  }

  const user = usersList[0];
  const check = await compareHash(oldPassword, user.password);
  if (!check) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);

  const userDoc = usersSnapshot.docs[0];
  await updateDoc(userDoc.ref, { password: hashedPassword });

  return true;
}

async function deleteAccount(db, userId) {
  try {
    const usersCollection = collection(db, 'users');
    const findUser = query(usersCollection, where("id", "==", userId));

    const usersSnapshot = await getDocs(findUser);
    const usersList = usersSnapshot.docs;

    if (usersList.length === 0) {
      return { success: false, message: "User not found." };
    }

    await Promise.all(usersList.map(userDoc => deleteDoc(userDoc.ref)));

    return { success: true, message: "Account successfully deleted." };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Error during deleting account." };
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

  var userInfo;

  if (!user) {
    userInfo = {
      username: "Account deleted",
      isCertified: false,
      color: "#808080",
      image: ""
    };
  } else {
    userInfo = {
      username: user.username,
      isCertified: user.isCertified,
      color: user.color,
      image: user.image
    };
  }

  return userInfo;
}

module.exports = { signin, signup, refreshSignin, changeImage, changeColor, changeUsername, changeEmail, changePassword, deleteAccount, certify, getUserInfo };