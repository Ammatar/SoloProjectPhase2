require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.DATABASE_STRING? process.env.DATABASE_STRING : 'mongodb://localhost:27017/justanotherrpg';
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const dbConnect = () => {
  mongoose.connect(mongoUrl, options).then(() => {
    console.log('DB connected');
  });
};

module.exports = { dbConnect, mongoUrl };
