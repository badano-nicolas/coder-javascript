class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1, hold: 10 },
        sprites = [],
        animate = false,
        isEnemy = false,
        rotation = 0,
        name
    }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy;
        this.rotation = rotation;
        this.name = name;

    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        canvasContext.rotate(this.rotation);
        canvasContext.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        );
        canvasContext.globalAlpha = this.opacity;
        canvasContext.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        canvasContext.restore;


        if (!this.animate) return


        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            }
            else {
                this.frames.val = 0;
            }
        }
    }
    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#battleDialog').style.display = 'block';
        document.querySelector('#battleDialog').innerHTML = this.name + ' usó ' + attack.name;
        const timeLine = gsap.timeline();
        let movementDistance = 20;
        let healthBar = '#enemy-health-bar';
        let rotation = 1;
        recipient.health -= attack.damage;

        if (this.isEnemy) {
            movementDistance = -20;
            healthBar = '#ally-health-bar';
            rotation = -2.5;
        }
        switch (attack.name) {
            case 'Placaje':
                timeLine.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        damageAnimation(recipient.health);
                    }
                }).to(this.position, {
                    x: this.position.x - 20
                });

                break;
            case 'Bola de Fuego':
                const fireballImage = new Image();
                fireballImage.src = './assets/img/attacks/fireball.png'
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    // rotation               // not working for some reason
                });

                // refactor to improve animation over enemy;
                renderedSprites.splice(1, 0, fireball);

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        damageAnimation(recipient.health);

                        // remove the same animation that was added before
                        renderedSprites.splice(1, 1);
                    }
                })

                break;
            default:
                break;
        }

        function damageAnimation(health) {
            gsap.to(healthBar, {
                width: health + '%'
            });
            gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.07
            });
            gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.07
            });
        }



    }
    faint() {
        document.querySelector('#battleDialog').innerHTML = this.name + 'fue derrotado!!';
        gsap.to(this.position, {
            y: this.position.y + 20
        }); 
        gsap.to(this, {
            opacity: 0
        });
    }
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
        canvasContext.fillStyle = 'rgba(255, 0, 0, 0.0)';
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}