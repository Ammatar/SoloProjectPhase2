const faker = require('faker');
const {
  Char, charClass, Skills, User,
} = require('../models/index.model');
const { dbConnect } = require('./db');

dbConnect();
const us = [];
const userSeed = async () => {
  await User.create({
    userName: String,
    userpassword: String,
    // userChars:
  });
};
const classSeed = async () => {
  const warrior = await charClass.create({
    charClassName: 'Warrior',
    charStr: 4,
    charDex: 3,
    charVit: 4,
    charInt: 1,
    charWis: 2,
  });
  return warrior;
  // await charClass.create({
  //   charClassName: String,
  //   charStr: Number,
  //   charDex: Number,
  //   charVit: Number,
  //   charInt: Number,
  //   charWis: Number,
  //   charBasicSkills: [String],
  // })
}
const skillsSeed = async () => {
  const cleave = await Skills.create({
    skillName: 'Cleave',
    skillEffect: 'AOE',
    skillLvl: 1,
  });
  return cleave;
  // await Skills.create({
  //   skillName: String,
  //   skillEffect: String,
  //   skillLvl: String,
  // })
};
const charSeed = async () => {
  const { skillName, skillEffect, skillLvl } = await skillsSeed();
  const classId = await classSeed();
  console.log(classId);
  const char = await Char.create({
    charName: 'Fedor',
    charRace: 'Slime',
    charGender: 'M',
    charSkin: 'img/CharSkins/Slime/static.png',
    charClass: classId._id,
    charLevel: 1,
    charSkills: { skillName, skillEffect, skillLvl },
  });
  // await Char.create({
  //   charName: String,
  //   charRace: String,
  //   charGender: String,
  //   charSkin: String,
  //   charClass: { type: mongoose.Schema.Types.ObjectId, ref: 'charClass' },
  //   charLevel: Number,
  //   charSkills:
  // })
};

const seedAll = async () => {
  await charSeed();
}

seedAll();
