export default class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.add.text(400, 200, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 270, 'Final Score: ' + this.finalScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(400, 350, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => this.scene.start('shooter'));

        const menuButton = this.add.text(400, 400, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('mainMenu'));
    }
} 