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

var laser;
var laserTime = 0;
var lasers;

var invader1Info;
var invaders1;
var invaders2;
var invaders3;

var newInvader1;
var newInvader2;
var newInvader3;

var playing = true;

const padding = 10;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#000000";
    //Loads sprites
    game.load.image("player", "media/spaceInvaders/player.png");
    game.load.image("invader1", "media/spaceInvaders/invader1.png");
    game.load.image("invader2", "media/spaceInvaders/invader2.png");
    game.load.image("invader3", "media/spaceInvaders/invader3.png");
    game.load.image("ufo", "media/spaceInvaders/ufo.png");
    game.load.image("laser", "media/spaceInvaders/laser.png");
    game.load.image("barracks", "media/spaceInvaders/barracks.png");
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
    for (i = 0; i < 20; i++) {
        var l = lasers.create(0, 0, "laser");
        l.name = "laser" + i;
        l.exists = false;
        l.visible = false;
        l.checkWorldBounds = true;
        l.events.onOutOfBounds.add(resetLaser, this);
    }
    spawnInvaders();
}

function update() {
    //If the game is running, check for arrowkey pushes every update
    if (playing) {
        if (arrowKeys.right.isDown) {
            player.x += 2;
        }
        if (arrowKeys.left.isDown) {
            player.x += -2;
        }
        if (arrowKeys.up.isDown) {
            fire();
        }
    }

    game.physics.arcade.collide(lasers, invaders1, laserHitInvader1);
    game.physics.arcade.collide(lasers, invaders2, laserHitInvader2);
    game.physics.arcade.collide(lasers, invaders3, laserHitInvader3);

}

function spawnInvader1(enemyType, eWidth, eHeight) {
    //Invader info (self explainatory)
    invader1Info = {
        width: 38,
        height: 24,
        count: {
            row: 11,
            col: 2
        },
        offset: {
            top: 150,
            left: 120
        },
        padding: padding
    }

    invader2Info = {
        width: 38,
        height: 24,
        count: {
            row: 11,
            col: 2
        },
        offset: {
            top: 220,
            left: 120
        },
        padding: 10
    }

    invader3Info = {
        width: 27,
        height: 24,
        count: {
            row: 11,
            col: 1
        },
        offset: {
            top: 115,
            left: 115.5
        },
        padding: 21.9
    }
    //spawns the invaders
    invaders1 = game.add.group();
    invaders2 = game.add.group();
    invaders3 = game.add.group();

    for (c = 0; c < invader1Info.count.col; c++) {
        for (r = 0; r < invader1Info.count.row; r++) {

            var invader1X = (r * (invader1Info.width + invader1Info.padding)) + invader1Info.offset.left;
            var invader1Y = (c * (invader1Info.height + invader1Info.padding)) + invader1Info.offset.top;

            newInvader1 = game.add.sprite(invader1X, invader1Y, "invader" + enemyType);
            game.physics.enable(newInvader1, Phaser.Physics.ARCADE);
            newInvader1.anchor.set(0.5);
            invaders1.add(newInvader1);

        }
    }

}

function spawnInvader2() {

    invader2Info = {
        width: 38,
        height: 24,
        count: {
            row: 11,
            col: 2
        },
        offset: {
            top: 220,
            left: 120
        },
        padding: 10
    }

    invaders2 = game.add.group();
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

}

function spawnInvader3() {

    invader3Info = {
        width: 27,
        height: 24,
        count: {
            row: 11,
            col: 1
        },
        offset: {
            top: 115,
            left: 115.5
        },
        padding: 21.9
    }

    invaders3 = game.add.group();
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

function laserHitInvader1(laser, invader1){
    laser.kill();
    invader1.kill();
}

function laserHitInvader2(laser, invader2){
    laser.kill();
    invader2.kill();
}

function laserHitInvader3(laser, invader3){
    laser.kill();
    invader3.kill();
}

function fire() {
    if (game.time.now > laserTime) {
        laser = lasers.getFirstExists(false);
        if (laser) {
            laser.reset(player.x - 1, player.y - 11);
            laser.body.velocity.y = -300;
            laserTime = game.time.now + 1300;
        }
    }
}

function resetLaser(laser) {
    laser.kill();
}