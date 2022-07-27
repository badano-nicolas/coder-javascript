const canvas = document.querySelector('canvas');

const canvasContext = canvas.getContext('2d');



canvas.width = 1024;
canvas.height = 576;

canvasContext.fillStyle = 'white';
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const mapImage = new Image();
mapImage.src = './assets/img/towns/town-0.png';


mapImage.onload = () => {
    canvasContext.drawImage(mapImage, 0, 0);
}


