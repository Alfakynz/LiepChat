const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const i18n = require('i18n');
const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
require('dotenv').config();

const { db, getCollection } = require('./config/firebaseConfig.js');
const userConfig = require('./config/userConfig.js');
const msgConfig = require('./config/msgConfig.js');
const { getPrincipalLanguage } = require('./config/language.js');
const { getFormattedDate } = require('./config/script.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

let connectedUsers = [];
let date;
const link = /https:\/\/\S+/g;

function generateUUID() {
  return crypto.randomUUID();
}

i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  queryParameter: 'lang',
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
app.use(i18n.init);
app.use((req, res, next) => {
  const navigatorLanguage = getPrincipalLanguage(req.headers['accept-language']);
  const languageChoised = i18n.getLocales().includes(navigatorLanguage) ? navigatorLanguage : 'en';
  i18n.setLocale(languageChoised);
  next();
});

app.get('/', (req, res) => {
  const translations = i18n.getCatalog(req);
  res.render('pages/index', {
    text: translations
  });
});

app.get('/signin', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.redirect('/welcome');
  }
  else {
    const translations = i18n.getCatalog(req);
    res.render('pages/signin', {
      text: translations
    });
  }
});

app.get('/signup', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.redirect('/welcome');
  }
  else {
    const translations = i18n.getCatalog(req);
    res.render('pages/signup', {
      text: translations
    });
  }
});

app.get('/welcome', (req, res) => {
  const user = req.session.user;
  if (user) {
    const translations = i18n.getCatalog(req);
    res.render('pages/welcome', {
      user: user,
      text: translations
    });
  }
  else {
    res.redirect('/');
  }
});

app.get('/main', (req, res) => {
  const user = req.session.user;
  if (user) {
    const translations = i18n.getCatalog(req);
    res.render('pages/main', {
      user: user,
      text: translations
    });
  }
  else {
    res.redirect('/');
  }
});

app.get('/profile', (req, res) => {
  const user = req.session.user;
  if (user) {
    const translations = i18n.getCatalog(req);
    res.render('pages/profile', {
      user: user,
      text: translations
    });
  }
  else {
    res.redirect('/');
  }
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

app.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userConfig.signin(db, username, password).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/welcome');
    }
    else {
      res.redirect('/signin')
    }
  }).catch(error => {
    console.error("Error :", error);
  })
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
      res.redirect('/signup')
    }
  }).catch(error => {
    console.error("Error :", error);
  })
});

app.post('/signout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/change-image', (req, res) => {
  const username = req.session.user.username;
  const newImage = req.body.image;
  userConfig.changeImage(db, username, newImage).then(isChanged => {
    if (isChanged) {
      req.session.user.image = newImage;
    }
    res.redirect('/profile');
  });
});

app.post('/change-color', (req, res) => {
  const username = req.session.user.username;
  const newColor = req.body.color;
  userConfig.changeColor(db, username, newColor).then(isChanged => {
    if (isChanged) {
      req.session.user.color = newColor;
    }
    res.redirect('/profile');
  });
});

app.post('/change-username', (req, res) => {
  const username = req.session.user.username;
  const newUsername = req.body.username;
  userConfig.changeUsername(db, username, newUsername).then(isChanged => {
    if (isChanged) {
      req.session.user.username = newUsername;
    }
    res.redirect('/profile');
  });
});

app.post('/change-email', (req, res) => {
  const username = req.session.user.username;
  const newEmail = req.body.email;
  userConfig.changeEmail(db, username, newEmail).then(isChanged => {
    if (isChanged) {
      req.session.user.email = newEmail;
    }
    res.redirect('/profile');
  });
});

app.post('/change-password', (req, res) => {
  const username = req.session.user.username;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  userConfig.changePassword(db, username, password, newPassword).then(isChanged => {
    res.redirect('/profile');
  });
});

app.post('/delete-account', (req, res) => {
  const username = req.session.user.username;
  userConfig.deleteAccount(db, username).then(isDeleted => {
    if (isDeleted) {
      req.session.destroy();
      res.redirect('/');
    }
    else {
      res.redirect('/profil');
    }
  })
});

app.post('/certify', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  userConfig.certify(db, username, email).then(isCertified => {
    res.redirect('/admin');
  });
});

app.use((req, res) => {
  const translations = i18n.getCatalog(req);
  res.status(404).render('pages/404', {
    text: translations
  });
});

io.on('connection', (socket) => {
  socket.on('page', (page, username) => {
    if (page === 'chat' && !connectedUsers.includes(username)) {
      connectedUsers.push(username);
    }
    io.emit("connectedUsers", connectedUsers);
    getCollection(db, 'chats').then(collection => {
      if (collection) {
        const chatData = collection[0] || {};
        const messages = chatData.messages || [];
        messages.forEach(message => {
          userConfig.getUsername(db, message.userId).then(username => {
            userConfig.getUserColor(db, message.userId).then(color => {
              const msg = message.content;
              const timestamp = message.sendAt;
              const date = new Date(timestamp.seconds * 1000);
              const formattedDate = getFormattedDate(date);

              io.emit('chat message', `<span class="user" style="color:${color};">${username}</span> <br> <span class="msg">${msg}</span> <span class="date">(${formattedDate})</span>`);
            });
          });
        });
      }
    });
  });

  socket.on('disconnection', (username) => {
    if (username) {
      connectedUsers = connectedUsers.filter(user => user !== username);
      io.emit("connectedUsers", connectedUsers);
    }
  });

  socket.on('chat message', (msg, username, userId, color) => {
    if (!/^\s*$/.test(msg)) {
      msgConfig.sendMessage(db, 'main', userId, msg);
      var liens = msg.match(link);
      if (liens) {
        msg = msg.replace(link, function (match) {
          return `<a href="${match}" target="_blank">${match}</a>`;
        });
      }
      const date = new Date(Date.now());
      const formattedDate = getFormattedDate(date);

      io.emit('chat message', `<span class="user" style="color:${color};">${username}</span> <br> <span class="msg">${msg}</span> <span class="date">(${formattedDate})</span>`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}\n`);
});
