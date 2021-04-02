const mongoose = require('mongoose');

const CharClass = new mongoose.Schema({
  charClassName: String,
  charStr: Number,
  charDex: Number,
  charVit: Number,
  charInt: Number,
  charWis: Number,
  charBasicSkills: [String], // or Object
});

module.exports = mongoose.model('CharClass', CharClass);
