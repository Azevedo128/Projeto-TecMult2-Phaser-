import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { restartSceneOnResize } from './ResizeRestart';
import { translate as t } from '../i18n';
import { playUiClick, playUiHover } from './UiSounds';

export class PauseMenu extends Scene
{
    overlay!: GameObjects.Rectangle;

    constructor ()
    {
        super('PauseMenu');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        restartSceneOnResize(this);
        this.events.once('language-changed', () => this.scene.restart());

        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.52)
            .setInteractive();

        this.add.rectangle(width / 2, height / 2, 520, 520, 0x10131b, 0.88)
            .setStrokeStyle(5, 0xffffff, 0.85);

        this.add.text(width / 2, height / 2 - 190, t(this, 'pause.title'), {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.createTextButton(width / 2, height / 2 - 90, t(this, 'pause.continue'), () => {
            this.resumeGame();
        });

        this.createTextButton(width / 2, height / 2 - 10, t(this, 'pause.restart'), () => {
            this.restartLevel();
        });

        this.createTextButton(width / 2, height / 2 + 70, t(this, 'pause.options'), () => {
            this.openOptions();
        });

        this.createTextButton(width / 2, height / 2 + 150, t(this, 'pause.exitLevel'), () => {
            this.exitLevel();
        });

        this.input.keyboard?.once('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    private createTextButton(x: number, y: number, label: string, onClick: () => void)
    {
        const button = this.add.rectangle(x, y, 320, 58, 0x1b1d26, 0.95)
            .setStrokeStyle(4, 0xffffff, 0.8)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const setHover = (active: boolean) => {
            if (active)
            {
                playUiHover(this, `pause-${label}`);
            }

            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.95);
            button.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.8);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });

        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => setHover(true));
        text.on('pointerout', () => setHover(false));
        text.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });
    }

    private resumeGame()
    {
        this.scene.resume('Game');
        this.scene.stop();
    }

    private restartLevel()
    {
        this.scene.stop('Game');
        this.scene.stop();
        this.scene.start('Game');
    }

    private openOptions()
    {
        this.scene.launch('OptionsOverlay', { returnScene: 'PauseMenu' });
        this.scene.bringToTop('OptionsOverlay');
    }

    private exitLevel()
    {
        stopLevelMusic(this);
        this.scene.stop('Game');
        this.scene.stop();
        this.scene.start('LevelMenu');
    }
}
