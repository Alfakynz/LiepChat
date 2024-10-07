function getRandomColor() {
  const aleatoire = Math.floor(Math.random() * 16777215);
  return `#${aleatoire.toString(16).padStart(6, '0')}`;
}

function isHexColor(color) {
  const regex = /^#[0-9A-Fa-f]{6}$/;
  return regex.test(color);
}

function userSignedIn(id, username, email, createdAt, isCertified, section, color, image) {
  const user = {
    isSignedIn: true,
    id: id,
    username: username,
    email: email,
    createdAt: createdAt,
    isCertified: isCertified,
    section: section,
    color: color,
    image: image
  };
  return user;
}

function userNotSignedIn() {
  const user = {
    isSignedIn: false
  };
  return user;
}

function getFormattedDate(date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = ("0" + (date.getHours())).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
}

function renderPage(page, req, res, i18n) {
  const user = req.session.user;
  if (user) {
    const translations = i18n.getCatalog(req);
    res.render(`pages/${page}`, {
      user: user,
      text: translations
    });
  } else {
    res.redirect('/');
  }
}

module.exports = { getRandomColor, isHexColor, userSignedIn, userNotSignedIn, getFormattedDate, renderPage }