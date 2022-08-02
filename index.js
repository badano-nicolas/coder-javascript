const canvas = document.querySelector('canvas');

const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillStyle = 'white';
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const mapImage = new Image();
mapImage.src = './assets/img/towns/town-0.png';

const playerImage = new Image();
playerImage.src = './assets/img/chars/main/down.png'

class Sprite {
    constructor({ position, velocity, image }) {
        this.position = position;
        this.image = image;
    }

    draw() {
        canvasContext.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x: -570,
        y: -165
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

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    canvasContext.drawImage(playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - playerImage.width / 4,
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    )

    if (keys.w.pressed) {
        background.position.y = background.position.y + 3;
    }
    if (keys.a.pressed) {
        background.position.x = background.position.x + 3;
    }
    if (keys.s.pressed) {
        background.position.y = background.position.y - 3;
    }
    if (keys.d.pressed) {
        background.position.x = background.position.x - 3;
    }
}

animate();

const detectKey = (event, pressed) => {
    const key = event.key;
    switch (key) {
        case "w":
            keys.w.pressed = pressed;
            break;
        case "a":
            keys.a.pressed = pressed;
            break;
        case "s":
            keys.s.pressed = pressed;
            break;
        case "d":
            keys.d.pressed = pressed;
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

