const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
const battleGroundMap = [];
const boudaries = [];
const battleGrounds = [];

const offset = {
    x: -564,
    y: -180
}

readMapJson();

canvasContext.fillStyle = 'white';
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const mapImage = new Image();
mapImage.src = './assets/img/towns/town-01.png';

const foregroundImage = new Image();
foregroundImage.src = './assets/img/towns/town-01-foreground.png';

const playerImageUp = new Image();
playerImageUp.src = './assets/img/chars/main/up.png'

const playerImageRight = new Image();
playerImageRight.src = './assets/img/chars/main/right.png'

const playerImageDown = new Image();
playerImageDown.src = './assets/img/chars/main/down.png'

const playerImageLeft = new Image();
playerImageLeft.src = './assets/img/chars/main/left.png'

const player = new Sprite({
    position: {
        // 192 is the width of the player image, can't wait to load the image to obtain
        x: canvas.width / 2 - 192 / 4,
        // 68  is the height of the player image, can't wait to load the image to obtain
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImageDown,
    frames: {
        max: 4
    },
    sprites: {
        up: playerImageUp,
        right: playerImageRight,
        down: playerImageDown,
        left: playerImageLeft
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: mapImage
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



function parseCollision(colli, battle) {
    // parse collision in rows of 70 columns
    for (let i = 0; i < colli.length; i += 70) {
        collisionsMap.push(colli.slice(i, 70 + i));
    }
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            // 1025 is the value when there is a boundary
            if (symbol === 1025) {
                boudaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }))
            }
        })
    });

    for (let i = 0; i < battle.length; i += 70) {
        battleGroundMap.push(battle.slice(i, 70 + i));
    }
    battleGroundMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            // 1025 is the value when there is a boundary
            if (symbol === 1025) {
                battleGrounds.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }))
            }
        })
    });
}



function rectangularCollision({ rectangle1, rectangle2: rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
};

function readMapJson() {
    fetch('../../assets/data/map-01.json').then(response => {
        return response.json();
    }).then(data => {
        const collisionLayer = data.layers.find(layer => layer.name === "Collision");
        const battleGroundLayer = data.layers.find(layer => layer.name === "BattleGround");
        const colli = collisionLayer.data;
        const battle = battleGroundLayer.data;

        parseCollision(colli, battle);

    }).catch(error => {
        // Do something with the error
    })
}

function animate() {
    // Creted this variable to simplify later, used spread to use a single array
    const movables = [background, ...boudaries, foreground, ...battleGrounds]

    window.requestAnimationFrame(animate);

    background.draw();
    boudaries.forEach((boundary) => {
        boundary.draw();

        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: boundary
            })
        ) {
            console.log('colliding')
        }
    });
    battleGrounds.forEach((battleGround) => {
        battleGround.draw();
    });

    player.draw();
    foreground.draw();


    let moving = true;
    player.moving = false;

    // Battle
    if (keys.w.pressed || keys.d.pressed || keys.s.pressed || keys.a.pressed) {
        for (let i = 0; i < battleGrounds.length; i++) {
            const battleGround = battleGrounds[i];
            const overlappingArea = (
                Math.min(player.position.x + player.width, battleGround.position.x + battleGround.width) -
                Math.max(player.position.x, battleGround.position.x)
            ) * (
                    Math.min(player.position.y + player.height, battleGround.position.y + battleGround.height) -
                    Math.max(player.position.y, battleGround.position.y)
                );
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectangle2: battleGround
                }) &&
                overlappingArea > (player.width * player.height) / 2 // to dont triger when the area is little
                && Math.random() < 0.015
            ) {
                console.log("Battle should start")
                break;
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {

        player.moving = true;
        player.image = player.sprites.up;

        for (let i = 0; i < boudaries.length; i++) {
            const boundary = boudaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y += 3;
            });
        }

    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boudaries.length; i++) {
            const boundary = boudaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 3;
            });
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boudaries.length; i++) {
            const boundary = boudaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 3;
            });
        }

    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boudaries.length; i++) {
            const boundary = boudaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 3;
            });
        }

    }


}

animate();

let lastKey = '';

const detectKey = (event, pressed) => {
    const key = event.key;
    switch (key) {
        case 'w':
            keys.w.pressed = pressed;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = pressed;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = pressed;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = pressed;
            lastKey = 'd';
            break;
        default:
            break;
    }
};

window.addEventListener('keydown', (e) => {
    detectKey(e, true);
});

window.addEventListener('keyup', (e) => {
    detectKey(e, false);
});

