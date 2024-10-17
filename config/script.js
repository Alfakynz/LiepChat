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
    res.redirect(page == 'section' ? '/welcome' : '/signin');
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
    img = `<img class="profile-pic" src=${image}>`
  } else {
    img = `<span style="width: 40px; height: 40px; margin-right: 10px; font-size: 20px; border-radius: 50%; color: ${color}; background-color: ${color}80; display: flex; align-items: center; justify-content: center;">${username[0]}</span>`;
  }

  if (isCertified) {
    certification = `<svg class="certification" style="fill: ${color}80;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 12.5L11 15l4.5-4.5m-.595-5.512l-.48-.659a3 3 0 00-4.85 0l-.48.659-.804-.127a3 3 0 00-3.43 3.43l.127.804-.659.48a3 3 0 000 4.85l.659.48-.127.804a3 3 0 003.43 3.43l.804-.127.48.659a3 3 0 004.85 0l.48-.659.804.127a3 3 0 003.43-3.43l-.127-.804.659-.48a3 3 0 000-4.85l-.659-.48.127-.804a3 3 0 00-3.43-3.43l-.804.127z"/></svg>`;
  } else {
    certification = '';
  }
  return `
  ${img}
  <div class="message-content">
    <div class="header-msg" style="display: flex; align-items: center;">
      <span class="username" style="color:${color};">${username}</span>
      ${certification}
    </div>

    <div class="content-msg">
      <span class="text">${message}</span>
    </div>

    <div class="footer-msg">
      <span class="date">(${formattedDate})</span>
    </div>
  </div>
  `;
}

module.exports = { getRandomColor, isHexColor, userSignedIn, userNotSignedIn, getFormattedDate, renderPage, fixHTML, getHTMLMessage }