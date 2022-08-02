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

mapImage.onload = () => {
    canvasContext.drawImage(mapImage, -570, -165);
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
}

window.addEventListener('keydown', (e) => {
    detectKeyDown(e);
})

const detectKeyDown = (event) => {
    const key = event.key;
    switch (key) {
        case "w":
            console.log("pressed w");
            break;
        case "s":
            console.log("pressed s");
            break;
        case "d":
            console.log("pressed d");
            break;
        case "a":
            console.log("pressed a");
            break;
        default:
            break;
    }
};