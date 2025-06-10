class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }

    create() {
        this.add.text(400, 150, 'Credits', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 250, 'Game developed by: Justin Thai', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Assets by: Kenney (www.kenney.nl)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const backButton = this.add.text(400, 450, 'Back', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.start('mainMenu'));
    }
}
