/*
 * BREAKOUT made by Marius Franzén using Phaser - marius.franzen1@gmail.com
 */

//Creates game canvas
var game = new Phaser.Game(480, 320, Phaser.CANVAS, "phaserGame", {
  preload: preload,
  create: create,
  update: update
});

//Variable declaration
var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var textStyle = {
  font: "18px Arial",
  fill: "#0095DD"
};
var playing = false;
var startButton;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "#eee";
  //Loads images and such
  game.load.image("ball", "media/phaserGame/ball.png");
  game.load.image("paddle", "media/phaserGame/paddle.png");
  game.load.image("brick", "media/phaserGame/brick.png");
  //Loads a spritesheet that consists of 3 frames, and each frame takes up 20 x 20 px
  game.load.spritesheet("ball", "media/phaserGame/wobble.png", 20, 20);
  game.load.spritesheet("button", "media/phaserGame/startbutton.png", 120, 40);
}

function create() {
  //Creates ball and adds physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 35, "ball");
  //Adds an animation for the ball called "wobble"
  ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
  ball.anchor.set(0.5);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  //Bounces of walls
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  //Does not bounce of bottom wall & lose life if it hits bottom
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);
  //Creates paddle and adds physics
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, "paddle");
  paddle.anchor.set(0.5, 1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;
  //Loads bricks
  initBricks();
  //Displays score
  scoreText = game.add.text(5, 5, "Points: " + score, textStyle);
  //Displays lives and such
  livesText = game.add.text(game.world.width - 5, 5, "Lives: " + lives, textStyle);
  livesText.anchor.set(1, 0);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, "Life lost, click to continue", textStyle)
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;
  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, "button", startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
}

function update() {
  //The ball and paddle can collide
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  //Ball collides with bricks
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  //The paddle follows the mouse
  if (playing) {
    paddle.x = game.input.x || game.world.width * 0.5;
  }
}

function initBricks() {
  //Info about the bricks
  brickInfo = {
    //Each bricks size is 50 x 20 px
    width: 50,
    height: 20,
    count: {
      //There are 7 x 3 bricks in total
      row: 7,
      col: 3
    },
    offset: {
      //The first one will be drawn 50 px from top and 60 px from left
      top: 50,
      left: 60
    },
    //There should be at least 10 px between each brick
    padding: 10
  }
  //Makes a new group of sprites called "bricks"
  bricks = game.add.group();
  //Draws each brick
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      //Brick X and Y location
      var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      //draws the brick and later adds it to the "bricks" group
      newBrick = game.add.sprite(brickX, brickY, "brick");
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      //Sets the anchor in the middle
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  //Plays the wobble function
  ball.animations.play("wobble");
  //Removes the brick that was hit
  var killTween = game.add.tween(brick.scale);
  killTween.to({
    x: 0,
    y: 0
  }, 200, Phaser.Easing.Linear.None);
  killTween.onComplete.addOnce(function() {
    brick.kill();
  }, this);
  killTween.start();
  //Adds score and changes the text
  score += 10;
  scoreText.setText("Points: " + score);

  var countAlive = -1;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      countAlive++;
    }
  }
  if (countAlive <= 0) {
    alert("You won the game! Congratulations!\nYour score is: " + score);
    location.reload();
  }
}

function ballLeaveScreen() {
  score -= 20;
  scoreText.setText("Points: " + score);
  lives--;
  if (lives > 0) {
    livesText.setText("Lives: " + lives);
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(function() {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("You lost, game over!");
    location.reload();
  }
}

function ballHitPaddle(ball, paddle) {
  ball.animations.play("wobble");
  ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}

function startGame() {
  startButton.destroy();
  ball.body.velocity.set(150, -150);
  playing = true;
  setInterval(loseScoreTime, 1000);
}

function loseScoreTime() {
  score--;
  scoreText.setText("Score: " + score);
}

function wait(ms){
  var d = new Date();
  var d2 = null;
  do{
    d2 = new Date();
  } while (d2 - d < ms)

}
