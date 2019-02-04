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
var laserCollisionGroup;
var laserHit = false;

var b;
var barracks;
var barrackCollisionGroup;
var bSpacingX = 160;
var bSpacingY = 380;

var ufo;
var invaders;
var invaders1;
var invaders2;
var invaders3;
var newInvader1;
var newInvader2;
var newInvader3;
var invaderX;
var invaderY;
var eMoveLeft = true;
var eMoveRight = false;
var moveTimer;
const ePadding = 10;
const eWidth = 38;
const eHeight = 24;
const eRow = 11;
const invader1Info = {
    type: "invader1",
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
const invader2Info = {
    type: "invader2",
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
const invader3Info = {
    type: "invader3",
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

var playing = true;

function preload() {
    //Gameframe settings
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
    game.load.image("barrack1", "media/spaceInvaders/barrack1.png");
    game.load.image("barrack2", "media/spaceInvaders/barrack2.png");
    game.load.image("barrack3", "media/spaceInvaders/barrack3.png");
    game.load.image("barrack4", "media/spaceInvaders/barrack4.png");
    game.load.image("heart", "media/spaceInvaders/heart.png");
    game.load.spritesheet("boom", "media/spaceInvaders/boom.png", 38, 25);
    //Loads hitbox
    game.load.physics("hitBox", "media/spaceInvaders/data/hitBoxData.json")
    //arrowkeys now work as input
    arrowKeys = game.input.keyboard.createCursorKeys();
}

function create() {
    //Starts the physics system
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 1;
    game.physics.p2.setImpactEvents(true);
    //Collisions
    laserCollisionGroup = game.physics.p2.createCollisionGroup();
    barrackCollisionGroup = game.physics.p2.createCollisionGroup();
    enemyCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();
    //Creates player sprite with physics
    player = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "player");
    player.anchor.setTo(0.5);
    game.physics.p2.enable(player);
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;
    player.body.setZeroDamping();

    spawnBarracks();
    //Creates the laser (reusable)
    laser = game.add.sprite(0, 0, "laser");
    game.physics.p2.enable(laser);
    laser.exists = false;
    laser.visible = false;
    laser.checkWorldBounds = true;
    laser.outOfBoundsKill = true;
    laser.body.collideWorldBounds = false;
    laser.body.fixedRotation = true;
    laser.body.setCollisionGroup(laserCollisionGroup);
    laser.body.collides([barrackCollisionGroup, enemyCollisionGroup]);

    invaders = game.add.group();
    invaders.physicsBodyType = Phaser.Physics.P2JS;
    invaders.enableBody = true;

    spawnInvaders(invader1Info);
    spawnInvaders(invader2Info);
    spawnInvaders(invader3Info);
    //Text
    livesText = game.add.text(8, 0, "LIVES: ", textStyle);
    scoreText = game.add.text(game.world.width - 150, 0, "SCORE: " + score, textStyle);

    moveTimer = game.time.create(false);
    moveTimer.add(3000, moveInvaders, this);
    moveTimer.start();
}

function update() {
    //If the game is running, check for arrowkey presses every update cycle
    if (playing) {
        if (arrowKeys.right.isDown) {
            player.body.moveRight(200);
        } else if (arrowKeys.left.isDown) {
            player.body.moveLeft(200);
        } else {
            player.body.setZeroVelocity();
        }
        if (arrowKeys.up.isDown) {
            fire();
        }
    }
}

function spawnBarracks() {
    //Creates group for barracks
    barracks = game.add.group();
    barracks.physicsBodyType = Phaser.Physics.P2JS;
    barracks.enableBody = true;
    //Loop that spawns 3 barracks and gives the proper physics
    for (let i = 0; i < 3; i++) {
        b = barracks.create(bSpacingX, bSpacingY, "barrack1");
        b.name = "barrack" + i;
        b.health = 15;
        b.body.clearShapes();
        b.body.loadPolygon("hitBox", "barracks");
        b.body.static = true;
        b.body.setCollisionGroup(barrackCollisionGroup);
        //b.body.debug = true;
        b.body.collides(laserCollisionGroup, laserHitBarrack, this);
        bSpacingX += 200;
    }
}

function spawnInvaders(eType) {
    for (c = 0; c < eType.count.col; c++) {
        for (r = 0; r < eType.count.row; r++) {
            invaderX = (r * (eType.width + eType.padding)) + eType.offset.left;
            invaderY = (c * (eType.height + eType.padding)) + eType.offset.top;

            e = invaders.create(invaderX, invaderY, eType.type);
            //Name = invaderType_row_column, eg. invader1_5_1
            e.name = eType.type + "_" + r + "_" + c;
            e.body.setCollisionGroup(enemyCollisionGroup);
            //e.body.debug = true;
            e.body.collides(laserCollisionGroup, laserHitInvader, this);
        }
    }
}

function moveInvaders() {
    console.log(invaders.children.length);
    for (i = 0; i < invaders.children.length; i++) {
        if (invaders.children[i].x <= 20) {
            eMoveLeft = false;
            eMoveRight = true;
        }
        if (invaders.children[i].x >= 700){
            eMoveLeft = true;
            eMoveRight = false;
        }
    }

    for (i = 0; i < invaders.children.length; i++) {
        if (invaders.children[i].alive) {
            if (eMoveLeft) {
                invaders.children[i].reset(invaders.children[i].x - 20, invaders.children[i].y);
            } else if (eMoveRight) {
                invaders.children[i].reset(invaders.children[i].x + 20, invaders.children[i].y);
            }
        }
    }
    moveTimer.add(3000, moveInvaders, this);
}

function spawnUfo() {

}

function laserHitInvader(invader, laser) {
    //Kills laser and invader
    laser.sprite.kill();
    invader.sprite.kill();
    //If the laser has not already collided with the invader, change the bool and increase your score
    if (!laserHit) {
        laserHit = true;
        if (invader.sprite.key === "invader2") {
            score += 10;
        } else if (invader.sprite.key === "invader1") {
            score += 20;
        } else if (invader.sprite.key === "invader3") {
            score += 40;
        }
    }
    scoreText.setText("SCORE: " + score);
}

function laserHitBarrack(barrack, laser) {
    //Kills the laser(allows it to be used again)
    laser.sprite.kill();
    //If the laser has not already collided with the barrack, change the bool and damage the barrack
    if (!laserHit) {
        laserHit = true;
        barrackDmg(barrack.sprite);
    }
}

function barrackDmg(barrack) {
    //Lowers barrack health and changes texture depending on HP levels. If 0 HP, kill the barrack
    barrack.health--;
    if (barrack.health === 12) {
        barrack.loadTexture("barrack2");
    } else if (barrack.health === 8) {
        barrack.loadTexture("barrack3");
    } else if (barrack.health === 4) {
        barrack.loadTexture("barrack4")
    } else if (barrack.health <= 0) {
        barrack.kill();
    }
}

function fire() {
    //If the laser has not been fired (exists), fire the laser
    if (!laser.exists) {
        laserHit = false;
        laser.reset(player.x, player.y - 7);
        laser.body.velocity.y = -400;
    }

}

function resetLaser(laser) {
    laser.kill();
}