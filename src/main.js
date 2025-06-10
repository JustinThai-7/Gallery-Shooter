import Shooter from './Scenes/shooter.js';
import MainMenu from './Scenes/mainMenu.js';
import Controls from './Scenes/controls.js';
import Credits from './Scenes/credits.js';
import GameOver from './Scenes/GameOver.js';
import HighScore from './Scenes/highScore.js';

const config = {
    type: Phaser.AUTO,
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
