const mongoose = require('mongoose');

const Char = new mongoose.Schema({
  charName: String,
  charRace: String,
  charGender: String,
  charSkin: String,
  charClass: { type: mongoose.Schema.Types.ObjectId, ref: 'CharClass' },
  charLevel: Number,
  charSkills: [Object],
});

module.exports = mongoose.model('Char', Char);
