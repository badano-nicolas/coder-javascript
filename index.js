const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];

// parse collision in rows of 70 columns
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boudaries = [];

const offset = {
    x: -570,
    y: -165
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
})

canvasContext.fillStyle = 'white';
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const mapImage = new Image();
mapImage.src = './assets/img/towns/town-0.png';

const playerImage = new Image();
playerImage.src = './assets/img/chars/main/down.png'

class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position;
        this.image = image;
        this.frames = frames;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };

    }

    draw() {
        canvasContext.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

const player = new Sprite({
    position: {
        // 192 is the width of the player image, can't wait to load the image to obtain
        x: canvas.width / 2 - 192 / 4,
        // 68  is the height of the player image, can't wait to load the image to obtain
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: mapImage
})

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

// Creted this variable to simplify later, used spread to use a single array
const movables = [background, ...boudaries]

function rectangularCollision({ rectangle1, rectabgle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectabgle2.position.x &&
        rectangle1.position.y + rectangle1.height >= rectabgle2.position.y &&
        rectangle1.position.x <= rectabgle2.position.x + rectabgle2.width &&
        rectangle1.position.y <= rectabgle2.position.y + rectabgle2.height
    )
};

function animate() {
    window.requestAnimationFrame(animate);

    background.draw();
    boudaries.forEach((boundary) => {
        boundary.draw();

        if (
            rectangularCollision({
                rectangle1: player,
                rectabgle2: boundary
            })
        ) {
            console.log('colliding')
        }
    });

    player.draw();



    let moving = true;
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boudaries.length; i++) {
            const boundary = boudaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    // creates clone of boundary without changing originall obj
                    rectabgle2: {
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
    else if (keys.a.pressed && lastKey === 'a') {
        movables.forEach(movable => {
            movable.position.x += 3;
        });
    }
    else if (keys.s.pressed && lastKey === 's') {
        movables.forEach(movable => {
            movable.position.y -= 3;
        });
    }
    else if (keys.d.pressed && lastKey === 'd') {
        movables.forEach(movable => {
            movable.position.x -= 3;
        });
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

