/*
 * SPACEINVADERS made by Marius Franzén using Phaser - marius.franzen1@gmail.com
 */

var game = new Phaser.Game(720, 480, Phaser.CANVAS, "spaceinvaders", {
    preload: preload,
    create: create,
    update: update
});

var player;
var arrowKeys;
var lives = 3;
var score = 0;

var livesText;
var scoreText;
var textStyle = {
    font: "12px Pixeled",
    fill: "#FFFFFF"
};

var laser;
var laserTime = 0;
var lasers;
var eLasers;

var barrack1;
var barrack2;
var barrack3;
var barrack1Health = 15;
var barrack2Health = 15;
var barrack3Health = 15;

var ufo;
var invader1Info;
var invader2Info;
var invader3Info;
var invaders1;
var invaders2;
var invaders3;
var newInvader1;
var newInvader2;
var newInvader3;

var playing = true;

const ePadding = 10;
const eWidth = 38;
const eHeight = 24;
const eRow = 11;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#000000";
    //Loads images
    game.load.image("player", "media/spaceInvaders/player.png");
    game.load.image("invader1", "media/spaceInvaders/invader1.png");
    game.load.image("invader2", "media/spaceInvaders/invader2.png");
    game.load.image("invader3", "media/spaceInvaders/invader3.png");
    game.load.image("ufo", "media/spaceInvaders/ufo.png");
    game.load.image("laser", "media/spaceInvaders/laser.png");
    game.load.image("barracks", "media/spaceInvaders/barracks.png");
    game.load.image("heart", "media/spaceInvaders/heart.png");
    //arrowkeys now work as input
    arrowKeys = game.input.keyboard.createCursorKeys();
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Creates player sprite
    player = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "player");
    player.anchor.setTo(0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    //Create lasers
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;
    for (i = 0; i < 1; i++) {
        let l = lasers.create(0, 0, "laser");
        l.name = "laser" + i;
        l.exists = false;
        l.visible = false;
        l.checkWorldBounds = true;
        l.events.onOutOfBounds.add(resetLaser, this);
    }
    //Barracks/shelter
    barrack1 = game.add.sprite(160, game.world.height - 100, "barracks");
    barrack1.anchor.setTo(0.5);
    barrack2 = game.add.sprite(game.world.width * 0.5, game.world.height - 100, "barracks");
    barrack2.anchor.setTo(0.5);
    barrack3 = game.add.sprite(562, game.world.height - 100, "barracks");
    barrack3.anchor.setTo(0.5);
    game.physics.enable(barrack1, Phaser.Physics.ARCADE);
    game.physics.enable(barrack2, Phaser.Physics.ARCADE);
    game.physics.enable(barrack3, Phaser.Physics.ARCADE);
    barrack1.body.immovable = true;
    barrack2.body.immovable = true;
    barrack3.body.immovable = true;

    spawnInvaders();

    livesText = game.add.text(8, 0, "LIVES: ", textStyle);
    scoreText = game.add.text(game.world.width - 150, 0, "SCORE: " + score, textStyle);
}

function update() {
    //If the game is running, check for arrowkey presses every update
    if (playing) {
        if (arrowKeys.right.isDown) {
            player.x += 2.5;
        }
        if (arrowKeys.left.isDown) {
            player.x += -2.5;
        }
        if (arrowKeys.up.isDown) {
            fire();
        }
    }

    game.physics.arcade.collide(lasers, invaders1, laserHitInvader);
    game.physics.arcade.collide(lasers, invaders2, laserHitInvader);
    game.physics.arcade.collide(lasers, invaders3, laserHitInvader);

    game.physics.arcade.collide(lasers, barrack1, laserHitBarrack);
    game.physics.arcade.collide(lasers, barrack2, laserHitBarrack);
    game.physics.arcade.collide(lasers, barrack3, laserHitBarrack);
    game.physics.arcade.collide(eLasers, barrack1, laserHitBarrack);
    game.physics.arcade.collide(eLasers, barrack2, laserHitBarrack);
    game.physics.arcade.collide(eLasers, barrack3, laserHitBarrack);

}

function spawnInvaders() {
    //Invader info (self explainatory)
    invader1Info = {
        width: eWidth,
        height: eHeight,
        count: {
            row: eRow,
            col: 2
        },
        offset: {
            top: 120,
            left: 120
        },
        padding: ePadding
    }

    invader2Info = {
        width: eWidth,
        height: eHeight,
        count: {
            row: eRow,
            col: 2
        },
        offset: {
            top: 190,
            left: 120
        },
        padding: ePadding
    }

    invader3Info = {
        width: eWidth,
        height: eHeight,
        count: {
            row: eRow,
            col: 1
        },
        offset: {
            top: 85,
            left: 120
        },
        padding: ePadding
    }
    //spawns the invaders
    invaders1 = game.add.group();
    invaders2 = game.add.group();
    invaders3 = game.add.group();

    for (c = 0; c < invader1Info.count.col; c++) {
        for (r = 0; r < invader1Info.count.row; r++) {

            var invader1X = (r * (invader1Info.width + invader1Info.padding)) + invader1Info.offset.left;
            var invader1Y = (c * (invader1Info.height + invader1Info.padding)) + invader1Info.offset.top;

            newInvader1 = game.add.sprite(invader1X, invader1Y, "invader1");
            game.physics.enable(newInvader1, Phaser.Physics.ARCADE);
            newInvader1.anchor.set(0.5);
            invaders1.add(newInvader1);

        }
    }

    for (c = 0; c < invader2Info.count.col; c++) {
        for (r = 0; r < invader2Info.count.row; r++) {

            var invader2X = (r * (invader2Info.width + invader2Info.padding)) + invader2Info.offset.left;
            var invader2Y = (c * (invader2Info.height + invader2Info.padding)) + invader2Info.offset.top;

            newInvader2 = game.add.sprite(invader2X, invader2Y, "invader2");
            game.physics.enable(newInvader2, Phaser.Physics.ARCADE);
            newInvader2.anchor.set(0.5);
            invaders2.add(newInvader2);

        }
    }

    for (c = 0; c < invader3Info.count.col; c++) {
        for (r = 0; r < invader3Info.count.row; r++) {

            var invader3X = (r * (invader3Info.width + invader3Info.padding)) + invader3Info.offset.left;
            var invader3Y = (c * (invader3Info.height + invader3Info.padding)) + invader3Info.offset.top;

            newInvader3 = game.add.sprite(invader3X, invader3Y, "invader3");
            game.physics.enable(newInvader3, Phaser.Physics.ARCADE);
            newInvader3.anchor.set(0.5);
            invaders3.add(newInvader3);

        }
    }

}

function spawnUfo() {

}

function laserHitInvader(laser, invader){
    laser.kill();
    invader.kill();
    if(invader.key == "invader2"){
        score += 10;
    } else if(invader.key == "invader1"){
        score += 20;
    } else if(invader.key == "invader3"){
        score += 40;
    }
    scoreText.setText("SCORE: " + score);
}

//TODO: Fix this bug... Barrack and Laser should switch places
function laserHitBarrack(barrack, laser){
    laser.kill();
    if(barrack.key == "barrack1"){
        barrack1Health--;
    } else if(barrack.key == "barrack2"){
        barrack2Health--;
    } else if(barrack.key == "barrack3"){
        barrack3Health--;
    }
}

function fire() {
        laser = lasers.getFirstExists(false);
        if (laser) {
            laser.reset(player.x - 1, player.y - 11);
            laser.body.velocity.y = -400;
        }
    
}

function resetLaser(laser) {
    laser.kill();
}