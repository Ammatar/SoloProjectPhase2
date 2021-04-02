const mongoose = require('mongoose');

const User = new mongoose.Schema({
  userName: String,
  userPassword: String,
  userChars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Char' }],
});

module.exports = mongoose.model('User', User);
