const mongoose = require('mongoose');

const Skill = new mongoose.Schema({
  skillName: String,
  skillEffect: String,
  skillLvl: Number,
});

module.exports = mongoose.model('Skill', Skill);
