const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const i18n = require('i18n');
const http = require('http');
const socketIO = require('socket.io');
const crypto = require('crypto');
require('dotenv').config();

const { db, getCollection, signin, signup, changeUsername, changePassword, deleteAccount } = require('./config/firebaseConfig.js');
const { getPrincipalLanguage } = require('./config/language.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

let connectedUsers = 0;
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
    res.redirect('/main');
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
    res.redirect('/main');
  }
  else {
    const translations = i18n.getCatalog(req);
    res.render('pages/signup', {
      text: translations
    });
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

app.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  signin(db, username, password).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/main');
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
  signup(db, username, password, confirmPassword, id).then(user => {
    if (user.isSignedIn) {
      req.session.user = user;
      res.redirect('/main');
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

app.post('/change-username', (req, res) => {
  const username = req.session.user.name;
  const newUsername = req.body.username;
  changeUsername(db, username, newUsername).then(isChanged => {
    if (isChanged) {
      req.session.user.name = newUsername;
    }
    res.redirect('/profile');
  });
});

app.post('/change-password', (req, res) => {
  const username = req.session.user.name;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  changePassword(db, username, password, newPassword).then(isChanged => {
    res.redirect('/profile');
  });
});

app.post('/delete-account', (req, res) => {
  const username = req.session.user.name;
  deleteAccount(db, username).then(isDeleted => {
    if (isDeleted) {
      req.session.destroy();
      res.redirect('/');
    }
    else {
      res.redirect('/profil');
    }
  })
});

app.use((req, res) => {
  const translations = i18n.getCatalog(req);
  res.status(404).render('pages/404', {
    text: translations
  });
});

io.on('connection', (socket) => {
  socket.on('page', (page) => {
    if (page === 'chat') {
      connectedUsers++;
    }
    io.emit("connectedUsers", connectedUsers);
  });

  socket.on('disconnection', () => {
    if (connectedUsers > 0) {
      connectedUsers--;
      io.emit("connectedUsers", connectedUsers);
    }
  });

  socket.on('chat message', (msg, username, color) => {
    var liens = msg.match(link);
    if (liens) {
      msg = msg.replace(link, function (match) {
        return `<a href="${match}" target="_blank">${match}</a>`;
      });
    }
    date = new Date(Date.now())
    var hours = date.getHours() + 2;
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    if (!/^\s*$/.test(msg)) {
      io.emit('chat message', `<span class="user" style="color:${color};">${username}</span> <br> <span class="msg">${msg}</span> <span class="date">(${formattedTime})</span>`)
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}\n`);
});
