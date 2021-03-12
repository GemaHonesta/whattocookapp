const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');

// init express-application
const app = express();

//connect view engine
app.engine('ejs', require('ejs-locals'));
app.set('views', (__dirname, 'views'));
app.set('view engine', 'ejs');

// connect DB
connectDB();

// parse of body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse of cookies
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  name:'uniqueSessionID',
  maxAge: null,
  httpOnly: true,
  resave: true,
  saveUninitialized: false ,
  cookie: {
    maxAge: 6000
  }
}));
app.use(flash());

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

// render html-pages
app.use(express.static(path.join(__dirname, 'public')))

// init middleware
app.use(express.json({extended: false}))

app.get('/', async (req,res) => {
  res.setHeader('Content-Type', 'text/html');
  res.render('login', {auth: false});
});

// Define router
app.use('/api/home', require('./routes/api/home'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/me', require('./routes/api/me'));
app.use('/api/grocery-list', require('./routes/api/grocery-list'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));