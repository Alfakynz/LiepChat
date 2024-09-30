const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const i18n = require('i18n');
require('dotenv').config();

const { db, getCollection, signin, signup, changeUsername, changePassword, deleteAccount } = require('../config/firebaseConfig.js');
const { getPrincipalLanguage } = require('../config/language.js');

const app = express();
const port = 3000;

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
app.set('views', path.join(__dirname, '../views'));
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
    res.redirect('/profil');
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
    res.redirect('/profil');
  }
  else {
    const translations = i18n.getCatalog(req);
    res.render('pages/signup', {
      text: translations
    });
  }
});

app.get('/profil', (req, res) => {
  const user = req.session.user;
  if (user) {
    const translations = i18n.getCatalog(req);
    res.render('pages/profil', {
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
  signin(db, username, password).then(isUser => {
    if (isUser) {
      req.session.user = {
        isSignedIn: true,
        name: username
      }
      res.redirect('/profil');
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
  signup(db, username, password, confirmPassword).then(isUser => {
    if (isUser) {
      req.session.user = {
        isSignedIn: true,
        name: username
      }
      res.redirect('/profil');
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
    res.redirect('/profil');
  });
});

app.post('/change-password', (req, res) => {
  const username = req.session.user.name;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  changePassword(db, username, password, newPassword).then(isChanged => {
    res.redirect('/profil');
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

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}\n`);
});
