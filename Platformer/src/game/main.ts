import { Boot } from './scenes/Boot';
import { CharacterMenu } from './scenes/CharacterMenu';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { LevelComplete } from './scenes/LevelComplete';
import { LevelMenu } from './scenes/LevelMenu';
import { MainMenu } from './scenes/MainMenu';
import { OptionsOverlay } from './scenes/OptionsOverlay';
import { PauseMenu } from './scenes/PauseMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 550 },
            debug: true
        }
    },
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CharacterMenu,
        LevelMenu,
        MainGame,
        PauseMenu,
        OptionsOverlay,
        LevelComplete,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
