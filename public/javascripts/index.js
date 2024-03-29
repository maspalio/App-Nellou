var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('left', 'assets/left-arrow.gif');
  game.load.image('right', 'assets/right-arrow.gif');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms;
var player;
var cursors;
var stars;

var score = 0;
var scoreText;

function create() {
  // We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // A simple background for our game
  game.add.sprite(0, 0, 'sky');

  // The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  platforms.enableBody = true; // We will enable physics for any object that is created in this group

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  ground.scale.setTo(2, 2);     // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.body.immovable = true; // This stops it from falling away when you jump on it

  game.input.multiInputOverride = Phaser.Input.TOUCH_OVERRIDES_MOUSE;
  // game.add.button(this.game.world.width - 200, game.world.height - 50, 'left',  function () { movePlayerLeft  ( player ) });
  // game.add.button(this.game.world.width - 100, game.world.height - 50, 'right', function () { movePlayerRight ( player ) });

  // Now let's create two ledges
  var ledge = platforms.create(400, 400, 'ground');

  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  // We need to enable physics on the player
  game.physics.arcade.enable(player);

  // Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  // Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  // Finally some stars to collect
  stars = game.add.group();

  stars.enableBody = true; // We will enable physics for any star that is created in this group

  // Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++) {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  // The score
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  // Our controls.
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  movePlayer ( player, cursors );
}

function collectStar (player, star) {
  // Removes the star from the screen
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;
}

function movePlayerLeft ( player ) {
  player.body.velocity.x = -150;

  player.animations.play('left');
}

function movePlayerRight ( player ) {
  player.body.velocity.x = 150;

  player.animations.play('right');
}

function movePlayer ( player, cursors ) {
  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if (cursors.left.isDown || (game.input.mousePointer.x < game.world.height/2 && game.input.mousePointer.isDown)) {
    movePlayerLeft ( player );
  }
  else if (cursors.right.isDown || (game.input.mousePointer.x > game.world.height/2 && game.input.mousePointer.isDown)) {
    movePlayerRight ( player );
  }
  else {
    player.animations.stop();

    player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
  }
  else if (cursors.down.isDown && !player.body.touching.down) {
    player.body.velocity.y = 350;
  }
}
