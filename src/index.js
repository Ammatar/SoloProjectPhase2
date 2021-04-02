import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800, //window.innerWidth,
  height: 600, //window.innerHeight - 5,
  parent: 'game',
  dom: {
    createContainer: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
const game = new Phaser.Game(config);

let level = 1;
let playerName;
let playerLevel;
let player;
let cursors;
let lastPlayerDirection;
let hit;
const collisionArray = [236, 252, 41, 45, 25, 26, 57, 61];
let house;
const enemies = [];
let map;
let shootTime = 0;
let moveTime = 0;

function preload() {
  // wait();
  // console.log(char.charSkin);
  // this.load.image('slime', `/img/CharSkins/Slime/idle.gif`);
  this.load.image('slime', `${charSkin}`);
  this.load.image('splash-01', '/img/CharSkins/splash-01.png');
  this.load.image('sensei', '/img/NPC/Enemys/sensei.png');
  this.load.image('bossBee', '/img/NPC/Enemys/boss_bee.png');
  // тайлы для карты
  this.load.image('tiles', '/img/TileMaps/MasterTileset1.0.png');
  // карта в json формате
  this.load.tilemapTiledJSON('map', '/img/TileMaps/FirstScene.json');
}

function create() {
  map = this.make.tilemap({ key: 'map' });
  //----------------------------------------------------------
  // инициплизация игрока
  player = this.physics.add.sprite(300, 600, 'slime');
  this.physics.world.bounds.width = map.widthInPixels;
  this.physics.world.bounds.height = map.heightInPixels;
  player.setCollideWorldBounds(true);
  //----------------------------------------------------------
  // отрисовка карты
  const tiles = map.addTilesetImage('Base_tiles', 'tiles');
  const ground = map.createLayer('Ground', [tiles], 0, 0).setDepth(-2);
  const roads = map.createLayer('Roads', [tiles], 0, 0).setDepth(-1);
  // const events = map.createLayer('Events', [tiles], 0, 0);
  house = map.createLayer('House', [tiles], 0, 0);
  //----------------------------------------------------------
  // физика препятствий
  this.physics.add.collider(player, house);
  house.setCollisionByProperty({ collides: true });
  house.setCollision(collisionArray);
  house.setTileLocationCallback(17, 35, 1, 1, () => {
    // console.log('quest');
    alert(charName + ' got New quest');
    house.setTileLocationCallback(17, 35, 1, 1, null);
  });

  //----------------------------------------------------------
  // надписи на карте
  playerName = this.add.text(player.x - 25, player.y - 25, `${charName}`, {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
  });

  //----------------------------------------------------------
  // ограничиваем камеру размерами карты
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // заставляем камеру следовать за игроком
  this.cameras.main.startFollow(player);
  // своего рода хак, чтобы предотвратить пояление полос в тайлах
  this.cameras.main.roundPixels = true;
  //----------------------------------------------------------
  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  const enemy = () => {
    const randX = Math.floor(Math.random() * 120) + 200;
    const randY = Math.floor(Math.random() * 80) + 360;
    const enemyI = this.physics.add.sprite(randX, randY, 'sensei'); // x 200-320, y 360-420
    enemyI.hp = 2;
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.physics.add.collider(enemies, house);
    // console.log(enemyI);
    enemyI.setCollideWorldBounds(true);
    return enemyI;
  };
  function randMove(i) {
    if (enemies[i]) {
      enemies[i].setVelocityX(0);
      enemies[i].setVelocityY(0);
      let plusM = Math.floor(Math.random() * (40 + 40 + 1)) - 40;
      let plusN = Math.floor(Math.random() * (40 + 40 + 1)) - 40;
      enemies[i].setVelocityX(plusM);
      enemies[i].setVelocityY(plusN);
    }
  }
  playerName.x = player.body.position.x - 25;
  playerName.y = player.body.position.y - 25;

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    lastPlayerDirection = 'left';
    // player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    lastPlayerDirection = 'right';
    // player.anims.play('right', true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-160);
    lastPlayerDirection = 'down';
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    lastPlayerDirection = 'up';
  } else {
    player.setVelocityX(0);
    player.setVelocityY(0);
    if (enemies[0]) {
      let secM = new Date().getTime() / 100;
      if (secM - moveTime > 15) {
        moveTime = new Date().getTime() / 100;
        for (let i = 0; i < enemies.length; i++) {
          randMove(i);
        }
      }
    }
  }
  if (cursors.space.isDown) {
    let sec = new Date().getTime() / 100;
    if (sec - shootTime > 15) {
      shootTime = new Date().getTime() / 100;
      hit = this.physics.add.sprite(
        player.body.position.x,
        player.body.position.y,
        'splash-01'
      );
      this.physics.add.collider(hit, house, () => {
        hit.destroy();
      });
      this.physics.add.overlap(hit, enemies, (hiit, enemyInstance) => {
        // console.log('hitted', enemyInstance);
        hiit.destroy();
        enemyInstance.hp -= 1;
        if (enemyInstance.hp === 0) {
          enemies.splice(enemies.indexOf(enemyInstance), 1);
          enemyInstance.destroy();
          enemies.push(enemy());
        }
      });
      switch (lastPlayerDirection) {
        case 'left':
          hit.setVelocityX(-160);
          break;
        case 'right':
          hit.setVelocityX(160);
          break;
        case 'up':
          hit.setVelocityY(160);
          break;
        case 'down':
          hit.setVelocityY(-160);
          break;
        default:
          break;
      }
    }
  }

  if (enemies.length === 0) {
    enemies.push(enemy());
  }
}
