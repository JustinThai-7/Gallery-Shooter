class HighScore extends Phaser.Scene {
    constructor() {
        super('highScore');
    }

    create() {
        this.add.text(400, 100, 'High Scores', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        for (let i = 0; i < highScores.length; i++) {
            this.add.text(400, 200 + i * 40, `${i + 1}. ${highScores[i]}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        }

        const backButton = this.add.text(400, 500, 'Back', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.start('mainMenu'));
    }
} 