if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const users = [
  {
    id: '1679856693439',
    name: 'given',
    email: 'givendra03@gmail.com',
    password: '$2b$10$swZ8n2N6FAh9MrxkTiMEweRCORLRbkkoyQ..xLETo9Ra49lZI4muG'
  }
]


mongoose.connect('mongodb://localhost:27017/sibarkasid', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () => {
  console.log('Database Connection Established!')
})

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));



app.get('/user', checkAuthenticated, (req, res) => {
  res.render('pages/user.ejs', {
     name: req.user.name,
     email: req.user.email
    });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('user/login.ejs');
});

app.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('user/signup.ejs');
});

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/signup');
  }
  console.log(users);
});

app.delete('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});


app.get('/home', (req, res) => {
  res.render('pages/home');
})


app.get('/products', (req, res) => {
  res.render('pages/products');
})


app.get('/saved', (req, res) => {
  res.render('pages/saved');
})


app.get('/upload', checkAuthenticated, (req, res) => {
  res.render('pages/upload');
})


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}


// untuk mengakses folder "public"
app.use(express.static('public'));
  

// Menjalankan server
app.listen(3000, () => {
  console.log('Server started on port 3000');
})

