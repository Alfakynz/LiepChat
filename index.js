const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const i18n = require('i18n');
const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { db, getCollection } = require('./config/firebaseConfig.js');
const userConfig = require('./config/userConfig.js');
const msgConfig = require('./config/msgConfig.js');
const { getPrincipalLanguage } = require('./config/language.js');
const { userNotSignedIn, getFormattedDate, renderPage, fixHTML, getHTMLMessage } = require('./config/script.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

let connectedUsers = {
  "main": [],
  "american": [],
  "arabic": [],
  "bachibac": [],
  "brasilian": [],
  "chinese": [],
  "temporal": []
};
const link = /https:\/\/\S+/g;

function generateUUID() {
  return crypto.randomUUID();
}

app.use(cookieParser());
i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'lang',
  directory: __dirname + '/languages',
  register: global,
});
app.use(session({
  secret: 'my-secret-key-session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use((req, res, next) => {
  i18n.init(req, res);
  if (req.query.lang) {
    res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });
  }
  next();
});
app.use(i18n.init);

app.get('/', (req, res) => {
  var user = req.session.user;
  req.session.user = user ? user : userNotSignedIn(null, "");
  user = req.session.user;
  const translations = i18n.getCatalog(req);
  res.render('pages/index', {
    user: user ? user : null,
    text: translations
  });
});

app.get('/about', (req, res) => {
  const user = req.session.user;
  const translations = i18n.getCatalog(req);
  res.render('pages/about', {
    user: user ? user : null,
    text: translations
  });
});

app.get('/admin', (req, res) => {
  const user = req.session.user;
  if (user && user.username == "admin") {
    const translations = i18n.getCatalog(req);
    res.render('pages/admin', {
      user: user,
      text: translations
    });
  }
  else {
    res.redirect('/404');
  }
});

app.get('/main', (req, res) => renderPage('main', req, res, i18n));
app.get('/profile', (req, res) => renderPage('profile', req, res, i18n));
app.get('/section', (req, res) => renderPage('section', req, res, i18n));
app.get('/signin', (req, res) => renderPage('signin', req, res, i18n));
app.get('/signup', (req, res) => renderPage('signup', req, res, i18n));
app.get('/temporal', (req, res) => renderPage('temporal', req, res, i18n));
app.get('/welcome', (req, res) => renderPage('welcome', req, res, i18n));

app.post('/certify', (req, res) => {
  const adminname = req.session.user.username;
  const username = req.body.username;
  const email = req.body.email;
  if (adminname !== "admin") {
    res.redirect('/404');
  }
  userConfig.certify(db, username, email).then(isCertified => {
    if (isCertified) {
      res.redirect('/admin');
    }
    else {
      res.redirect('/404');
    }
  });
});

app.post('/change-color', (req, res) => {
  const id = req.session.user.id;
  const newColor = req.body.color;
  userConfig.changeColor(db, id, newColor).then(isChanged => {
    if (isChanged) {
      req.session.user.color = newColor;
    }
    res.redirect('/profile');
  });
});

app.post('/change-image', (req, res) => {
  const id = req.session.user.id;
  const newImage = req.body.image;
  userConfig.changeImage(db, id, newImage).then(isChanged => {
    if (isChanged) {
      req.session.user.image = newImage;
    }
    res.redirect('/profile');
  });
});

app.post('/change-email', (req, res) => {
  const id = req.session.user.id;
  const newEmail = req.body.email;
  userConfig.changeEmail(db, id, newEmail).then(isChanged => {
    if (isChanged) {
      req.session.user.email = newEmail;
    }
    res.redirect('/profile');
  });
});

app.post('/change-password', (req, res) => {
  const id = req.session.user.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  userConfig.changePassword(db, id, oldPassword, newPassword, confirmPassword).then(isChanged => {
    if (isChanged) {
      req.session.user.password = newPassword;
    }
    else {
      req.session.user.error = "passwordChangeError";
    }
    res.redirect('/profile');
  });
});

app.post('/change-username', (req, res) => {
  const id = req.session.user.id;
  const newUsername = req.body.username;
  userConfig.changeUsername(db, id, newUsername).then(isChanged => {
    if (isChanged) {
      req.session.user.username = newUsername;
    }
    res.redirect('/profile');
  });
});

app.post('/delete-account', (req, res) => {
  const id = req.session.user.id;
  userConfig.deleteAccount(db, id).then(isDeleted => {
    if (isDeleted) {
      req.session.destroy();
      res.redirect('/');
    }
    else {
      res.redirect('/profil');
    }
  })
});

app.post('/refreshSignin', (req, res) => {
  const id = req.session.user.id;
  userConfig.refreshSignin(db, id).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/profile');
    }
    else {
      req.session.user = user
      res.redirect('/signin');
    }
  });
});

app.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userConfig.signin(db, username, password).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/welcome');
    }
    else {
      req.session.user = user
      res.redirect('/signin')
    }
  }).catch(error => {
    console.error("Error:", error);
  })
});

app.post('/signout', (req, res) => {
  req.session.user = userNotSignedIn(null, "");
  res.redirect('/');
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const id = generateUUID();
  userConfig.signup(db, username, password, confirmPassword, id).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/welcome');
    }
    else {
      req.session.user = user
      res.redirect('/signup')
    }
  }).catch(error => {
    console.error("Error :", error);
  })
});

app.use((req, res) => {
  const user = req.session.user;
  const translations = i18n.getCatalog(req);
  res.status(404).render('pages/404', {
    user: user ? user : null,
    text: translations
  });
});

io.on('connection', (socket) => {
  socket.on('connection', (chatId, username) => {
    socket.join(chatId);

    if (!connectedUsers[chatId].includes(username)) {
      connectedUsers[chatId].push(username);
    }
    io.to(chatId).emit("connectedUsers", connectedUsers[chatId]);

    if (chatId !== 'temporal') {
      getCollection(db, 'chats').then(collection => {
        if (collection) {
          const chat = collection.filter(chat => chat.id == chatId);
          const chatData = chat[0] || {};
          var messages = chatData.messages || [];
          messages.sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt));

          const promises = messages.map(message => {
            return userConfig.getUserInfo(db, message.userId).then(userInfo => {
              const username = fixHTML(userInfo.username);
              const isCertified = userInfo.isCertified;
              const color = userInfo.color;
              const image = userInfo.image;
              var msg = fixHTML(message.content);
              if (msg.match(link)) {
                msg = msg.replace(link, function (match) {
                  return `<a href="${match}" target="_blank">${match}</a>`;
                });
              }
              const lang = socket.handshake.query.lang || 'en';
              const translations = i18n.getCatalog(lang);
              const atText = translations['at'] || 'at';
              const timestamp = message.sendAt;
              const date = new Date(timestamp.seconds * 1000);
              const formattedDate = getFormattedDate(date, atText);

              return getHTMLMessage(msg, formattedDate, username, isCertified, color, image);
            });
          });

          Promise.all(promises).then(results => {
            results.forEach(htmlMessage => {
              socket.emit('message', htmlMessage);
            });
          });

        }
      });
    }
  });

  socket.on('disconnection', (chatId, username) => {
    if (username) {
      connectedUsers[chatId] = connectedUsers[chatId].filter(user => user !== username);
      io.to(chatId).emit("connectedUsers", connectedUsers[chatId]);
    }
  });

  socket.on('message', (chatId, msg, username, userId, isCertified, color, image) => {
    msg = msg.replace(/^\n+|\n+$/g, '').replace(/\n{4,}/g, '\n\n\n')
    if (!/^\s*$/.test(msg)) {
      if (chatId !== 'temporal') {
        msgConfig.sendMessage(db, chatId, userId, msg);
      }
      msg = fixHTML(msg);
      if (msg.match(link)) {
        msg = msg.replace(link, function (match) {
          return `<a href="${match}" target="_blank">${match}</a>`;
        });
      }
      const lang = socket.handshake.query.lang || 'en';
      const translations = i18n.getCatalog(lang);
      const atText = translations['at'];
      const date = new Date(Date.now());
      const formattedDate = getFormattedDate(date, atText);

      io.to(chatId).emit('message', getHTMLMessage(msg, formattedDate, username, isCertified, color, image));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}\n`);
});
