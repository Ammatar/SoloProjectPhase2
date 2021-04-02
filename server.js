const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const DIST_DIR = path.join(__dirname, '/dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const { dbConnect, mongoUrl } = require('./db/db');
const {Char, charClass, Skills, User} = require('./models/index.model');
const { log } = require('console');

app.set('view engine', 'hbs');

dbConnect();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'show me your favorite route',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }, // maxAge: 60000
    store: MongoStore.create({ mongoUrl }),
  })
);
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.session = req.session;
  console.log('  req.session ==>', req.session);
  next();
});
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/game', (req, res) => {
  // console.log(req.session);
  const sess = req.session;
  res.render('game', { sess });
});
app.post('/login', (req, res) => {
  // console.log(req.body);
  // passwordField
  req.session.username = req.body.loginField;
  res.redirect('/charSelect');
});
app.get('/registration', (req, res) => {
  res.render('registration');
});
app.post('/registration', async (req, res) => {
  const ifUser = await User.findOne({ userName: req.body.loginField });
  if (!ifUser) {
    await User.create({ userName: req.body.loginField, userPassword: req.body.passwordField });
    res.redirect('/');
  } else {
    res.redirect('/registration');
  }
});
app.get('/charCreate', async(req, res) => {
  const classes = await charClass.find();
  res.render('charCreate', { classes });
});
app.post('/charCreate', async (req, res) => {
  // charName, charRace, charGender, charSkin, charClass || charLevel
  // console.log(req.body);
  if (req.body.charName) {
    const { charName, charRace, charGender, charSkin, charClassId } = req.body;
    const ifChar = await Char.findOne({ charName: req.body.charName });
    const classId = await charClass.findOne({ _id: charClassId });
    // console.log(classId);
    if (!ifChar) {
      const usr = await User.findOne({ userName: req.session.username });
      const newChar = await Char.create({
        charName, charRace, charGender, charSkin, charClass: classId._id, charLevel: 1,
      });
      usr.userChars.push(newChar._id);
      usr.save();
    }
  }
  res.redirect('/charSelect');
});
app.get('/charSelect', async (req, res) => {
  let chars = '';
  const charId = await User.findOne({ userName: req.session.username }).populate('userChars');
  if (charId) {
    chars = charId.userChars;
    console.log(chars);
  }
  // const chars = await Char.find().populate('charClass');
  // console.log(chars);
  res.render('charSelect', { chars });
});
app.post('/charSelect', async (req, res) => {
  const char = await Char.findOne({ _id: req.body.id }).populate('charClass');
  // console.log(char);
  req.session.char = char;
  res.locals.char = req.session.char;
  res.redirect('/game');
})
app.post('/getChar', async (req, res) => {
  // const getChar = await Char.findOne({ _id: req.session.char._id }).populate('charClass');
  res.json({ char: req.session.char });
});
app.get('/exit', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
// app.get('*', (req, res) => {
//   res.sendFile(HTML_FILE);
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
