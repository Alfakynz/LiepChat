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
  if ((user && page != "section") || (page == "section" && user && user.section != null)) {
    const translations = i18n.getCatalog(req);
    res.render(`pages/${page}`, {
      user: user,
      text: translations
    });
  } else {
    res.redirect(page == 'section' ? '/welcome' : '/');
  }
}

function fixHTML(html) {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br />');
}

function getHTMLMessage(message, formattedDate, username, isCertified, color, image) {
  var img;
  var certification;

  if (image) {
    img = `<img class="img-profil" style="width: 20px; height: 20px; border-radius: 50%;" src="${image}" />`;
  } else {
    img = `<span class="div-profil" style="width: 20px; height: 20px; border-radius: 50%; color: ${color}; background-color: ${color}80; display: flex; align-items: center; justify-content: center;">${username[0]}</span>
`;
  }

  if (isCertified) {
    certification = '<span class="certified">Certifié</span>';
  } else {
    certification = '';
  }
  return `
  <div class="header-msg" style="display: flex; align-items: center;">
    ${img}
    <span style="color:${color};">${username}</span>
    ${certification}
  </div>
  <div class="content-msg">
    <span class="msg">${message}</span>
  </div>
  <div class="footer-msg">
    <span class="date">(${formattedDate})</span>
  </div>`;

}

module.exports = { getRandomColor, isHexColor, userSignedIn, userNotSignedIn, getFormattedDate, renderPage, fixHTML, getHTMLMessage }