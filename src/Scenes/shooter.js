export default class Shooter extends Phaser.Scene {
    constructor() {
        super('shooter');
        this.playerSpeed = 400;
        this.missileSpeed = 400;
        this.wave = 1;
    }

    preload() {
        this.load.image('player', 'assets/playerShip.png');
        this.load.image('enemyBase', 'assets/enemyBase.png');
        this.load.image('enemyShooter', 'assets/enemyShooter.png');
        this.load.image('playerMissile', 'assets/playerMissile.png');
        this.load.image('enemyMissile', 'assets/enemyShooterMissile.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background').setOrigin(0, 0);
        this.score = 0;
        this.playerHealth = 3;
        this.wave = 1;
        this.isSpawning = false;
        this.isGameOver = false;

        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerMissiles = this.physics.add.group({
            defaultKey: 'playerMissile',
            maxSize: 10
        });

        this.enemies = this.physics.add.group();

        this.enemyMissiles = this.physics.add.group({
            defaultKey: 'enemyMissile',
            maxSize: 30
        });

        this.pathFollowers = this.physics.add.group();

        this.spawnWave();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        this.healthText = this.add.text(16, 40, 'Health: 3', { fontSize: '20px', fill: '#fff' });
        this.waveText = this.add.text(this.game.config.width - 100, 16, 'Wave: 1', { fontSize: '20px', fill: '#fff' });
    }

    update() {
        this.background.tilePositionY -= 0.5;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.firePlayerMissile();
        }

        this.checkCollisions();

        this.playerMissiles.children.each(missile => {
            if (missile.active && missile.y < 0) {
                missile.setActive(false);
            }
        });

        this.enemyMissiles.children.each(missile => {
            if (missile.active && missile.y > 600) {
                missile.setActive(false);
            }
        });

        if (this.enemies.countActive() === 0 && !this.isSpawning) {
            this.isSpawning = true;
            this.wave++;
            this.waveText.setText('Wave: ' + this.wave);
            this.score += 100;
            this.scoreText.setText('Score: ' + this.score);
            this.enemyMissiles.clear(true, true);
            this.time.delayedCall(1000, this.spawnWave, [], this);
        }
    }

    firePlayerMissile() {
        const missile = this.playerMissiles.get(this.player.x, this.player.y - 50);
        if (missile) {
            missile.setActive(true);
            missile.setVisible(true);
            missile.setVelocityY(-this.missileSpeed);
        }
    }

    spawnWave() {
        const enemiesToSpawn = this.wave * 2;
        const spawnDelay = 500; // ms
        const totalWaveSpawnTime = enemiesToSpawn * spawnDelay;

        for (let i = 0; i < enemiesToSpawn; i++) {
            this.time.delayedCall(i * spawnDelay, () => {
                const x = Phaser.Math.Between(100, 700);
                const y = Phaser.Math.Between(-200, -50);
                const enemyType = this.wave === 1 ? 'enemyBase' : Phaser.Math.RND.pick(['enemyBase', 'enemyShooter']);

                const enemy = this.enemies.create(x, y, enemyType);
                enemy.setActive(true);
                enemy.setVisible(true);
                enemy.setVelocityY(Phaser.Math.Between(50, 100));

                enemy.tween = this.tweens.add({
                    targets: enemy,
                    x: enemy.x + Phaser.Math.RND.pick([-1, 1]) * 150,
                    ease: 'Sine.easeInOut',
                    duration: 2000,
                    yoyo: true,
                    repeat: -1
                });

                if (enemy.texture.key === 'enemyShooter') {
                    enemy.shootTimer = this.time.addEvent({
                        delay: Phaser.Math.Between(1000, 3000),
                        callback: () => this.enemyFire(enemy),
                        loop: true,
                        callbackScope: this
                    });
                }
            });
        }

        this.time.delayedCall(totalWaveSpawnTime, () => {
            this.isSpawning = false;
        }, [], this);
    }

    hitEnemy(missile, enemy) {
        missile.setActive(false).setVisible(false);
        if (enemy.shootTimer) {
            enemy.shootTimer.remove(false);
        }
        if (enemy.tween) {
            enemy.tween.stop();
        }
        enemy.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    playerHit(player, enemy) {
        if (enemy.shootTimer) {
            enemy.shootTimer.remove(false);
        }
        if (enemy.tween) {
            enemy.tween.stop();
        }
        enemy.destroy();
        this.playerHealth -= 1;
        this.healthText.setText('Health: ' + this.playerHealth);

        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    playerHitByMissile(player, missile) {
        missile.setActive(false).setVisible(false);
        this.playerHealth -= 1;
        this.healthText.setText('Health: ' + this.playerHealth);

        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    enemyFire(enemy) {
        if (enemy.active) {
            const missile = this.enemyMissiles.get(enemy.x, enemy.y + 50);
            if (missile) {
                missile.setActive(true);
                missile.setVisible(true);
                missile.setVelocityY(300);
            }
        }
    }

    checkCollisions() {
        const playerMissiles = this.playerMissiles.getChildren();
        const allEnemies = this.enemies.getChildren();
        const enemyMissiles = this.enemyMissiles.getChildren();

        // Using reverse loops is safer when removing items during iteration
        for (let i = playerMissiles.length - 1; i >= 0; i--) {
            const missile = playerMissiles[i];
            if (!missile.active) continue;

            for (let j = allEnemies.length - 1; j >= 0; j--) {
                const enemy = allEnemies[j];
                if (enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(missile.getBounds(), enemy.getBounds())) {
                    this.hitEnemy(missile, enemy);
                    break; // Missile is destroyed, stop checking it against other enemies
                }
            }
        }

        for (let i = allEnemies.length - 1; i >= 0; i--) {
            const enemy = allEnemies[i];
            if (!enemy.active) continue;

            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) {
                this.playerHit(this.player, enemy);
                continue; 
            }

            if (enemy.y > this.game.config.height) {
                this.enemyReachedBottom(enemy);
            }
        }

        for (let i = enemyMissiles.length - 1; i >= 0; i--) {
            const missile = enemyMissiles[i];
            if (this.player.active && missile.active && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), missile.getBounds())) {
                this.playerHitByMissile(this.player, missile);
            }
        }
    }

    enemyReachedBottom(enemy) {
        if (enemy.shootTimer) {
            enemy.shootTimer.remove(false);
        }
        if (enemy.tween) {
            enemy.tween.stop();
        }
        enemy.destroy();
        this.playerHealth -= 1;
        this.healthText.setText('Health: ' + this.playerHealth);

        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.updateHighScores(this.score);
            this.scene.start('gameOver', { score: this.score });
        }
    }

    updateHighScores(score) {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 5)));
    }
}
