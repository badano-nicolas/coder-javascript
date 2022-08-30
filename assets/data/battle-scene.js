const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage
});

const enemy = new Sprite({
    position: {
        x: 800,
        y: 100,
    },
    image: enemySpriteImage,
    frames: {
        max: 4,
        hold: 35
    },
    animate: true,
    isEnemy: true,
    name: 'CoderHouse'
});

const ally = new Sprite({
    position: {
        x: 280,
        y: 325,
    },
    image: allySpriteImage,
    frames: {
        max: 4,
        hold: 35
    },
    animate: true,
    name: 'Nico'
});

const renderedSprites = [enemy, ally];
function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    });
}

const queue = [];

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (event) => {
        const selectedAttack = attacks[event.path[0].id];
        ally.attack({
            attack: selectedAttack,
            recipient: enemy,
            renderedSprites
        });

        if (enemy.health <= 0) {
            queue.push(() => {
                enemy.faint();
            });
            return;
        }

        queue.push(() => {
            enemy.attack({
                attack: attacks.Tackle,
                recipient: ally,
                renderedSprites
            });

            if (ally.health <= 0) {
                queue.push(() => {
                    ally.faint();
                });
                return;
            }
        })
    });
});

document.querySelector('#battleDialog').addEventListener('click', (event) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    }
    else {
        event.currentTarget.style.display = 'none';
    }
});

