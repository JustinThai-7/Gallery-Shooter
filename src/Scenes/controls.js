export default class Controls extends Phaser.Scene {
    constructor() {
        super('controls');
    }

    create() {
        this.add.text(400, 150, 'Controls', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 250, 'Left/Right Arrow Keys: Move', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Spacebar: Fire Missile', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const backButton = this.add.text(400, 450, 'Back', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.start('mainMenu'));
    }
}
