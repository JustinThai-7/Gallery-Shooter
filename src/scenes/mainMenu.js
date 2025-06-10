class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainMenu');
    }

    create() {
        this.add.text(400, 200, 'Gallery Shooter', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const playButton = this.add.text(400, 300, 'Play', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => this.scene.start('shooter'));

        const controlsButton = this.add.text(400, 350, 'Controls', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        controlsButton.setInteractive();
        controlsButton.on('pointerdown', () => this.scene.start('controls'));

        const highScoresButton = this.add.text(400, 400, 'High Scores', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        highScoresButton.setInteractive();
        highScoresButton.on('pointerdown', () => this.scene.start('highScore'));

        const creditsButton = this.add.text(400, 450, 'Credits', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        creditsButton.setInteractive();
        creditsButton.on('pointerdown', () => this.scene.start('credits'));
    }
}
