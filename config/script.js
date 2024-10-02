function getRandomColor() {
  const aleatoire = Math.floor(Math.random() * 16777215);
  return `#${aleatoire.toString(16).padStart(6, '0')}`;
}

function userSignedIn(id, username, email, createdAt, isCertified, color) {
  const user = {
    isSignedIn: true,
    id: id,
    username: username,
    email: email,
    createdAt: createdAt,
    isCertified: isCertified,
    color: color
  };
  return user;
}

function userNotSignedIn() {
  const user = {
    isSignedIn: false
  };
  return user;
}

module.exports = { getRandomColor, userSignedIn, userNotSignedIn }