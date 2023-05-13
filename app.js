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

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/sibarkasid';
const retrieveProducts = require('./retrieve-product.js');
const retrieveSaved = require('./retrieve-saved.js');


const initializePassport = require('./passport-config');
initializePassport(
  passport,
  async (email) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db('sibarkasid');
    const user = await db.collection('users').findOne({ email: email });
    client.close();
    return user;
  },
  async (id) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db('sibarkasid');
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    client.close();
    return user;
  }
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


app.get('/products', async (req, res) => {
  const keyword = req.query.keyword || '';
  try {
    const products = await retrieveProducts(keyword);
    res.render('pages/products', { products, keyword });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/user', checkAuthenticated, (req, res) => {
  res.render('pages/user', {
     name: req.user.username,
     email: req.user.email,
     fullName: req.user.fullName,
     phone: req.user.phone,
     address: req.user.address
    });
});

app.put('/user', checkAuthenticated, (req, res) => {
  const userId = req.user.id;
  const { fullName, email, phone, address } = req.body;

  // Lakukan operasi update pada database MongoDB
  // Pastikan Anda memiliki koneksi database MongoDB yang valid
  // dan collection users sudah tersedia
  db.collection('users').updateOne(
    { _id: ObjectId(userId) },
    { $set: { fullName, email, phone, address } },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Terjadi kesalahan pada server' });
      } else {
        res.status(200).send({ message: 'Data berhasil diupdate' });
      }
    }
  );
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
    failureFlash: true
  })
);

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('user/signup.ejs');
});

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db('sibarkasid');

    await db.collection('users').insertOne({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    client.close();

    res.redirect('/login');
  } catch {
    res.redirect('/signup');
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/login');
  });
});



app.get('/home', (req, res) => {
  res.render('pages/home');
})

// route untuk menampilkan halaman saved product
app.get('/saved', function(req, res) {
  res.render('pages/saved')
});


app.get('/user/upload', checkAuthenticated, (req, res) => {
  res.render('user/upload');
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

