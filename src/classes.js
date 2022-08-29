class Sprite {
    constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites = [], animate = false, isEnemy = false }) {
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
        this.isEnemy = isEnemy

    }

    draw() {
        canvasContext.save();
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
    attack({ attack, recipient }) {
        const timeLine = gsap.timeline();
        this.health -= attack.damage;
        let movementDistance = 20;
        let healthBar = '#enemy-health-bar';
        if (this.isEnemy) {
            movementDistance = -20;
            healthBar = '#ally-health-bar';
        }


        timeLine.to(this.position, {
            x: this.position.x - movementDistance
        }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
                gsap.to(healthBar, {
                    width: this.health + '%'
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
        }).to(this.position, {
            x: this.position.x - 20
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