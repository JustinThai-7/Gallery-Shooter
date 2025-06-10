window.onload = function() {
    const config = {
        type: Phaser.CANVAS,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MainMenu, Shooter, Controls, Credits, GameOver, HighScore]
    };

    const game = new Phaser.Game(config);
};
