import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { translate as t } from '../i18n';
import { playUiClick, playUiHover } from './UiSounds';

export class GameOver extends Scene
{
    title!: GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const panelWidth = Math.min(620, width * 0.82);
        const panelHeight = 430;
        const centerX = width / 2;
        const centerY = height / 2;

        stopLevelMusic(this);

        this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.56)
            .setInteractive();

        this.add.rectangle(centerX, centerY, panelWidth, panelHeight, 0x10131b, 0.92)
            .setStrokeStyle(5, 0xffffff, 0.75);

        this.title = this.add.text(centerX, centerY - 130, t(this, 'gameOver.title'), {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 9,
            align: 'center'
        }).setOrigin(0.5);

        const buttonY = centerY + 45;
        const spacing = Math.min(190, width * 0.24);

        this.createMenuButton(centerX - spacing, buttonY, 'menu-restart', 'menu-restart-hover', t(this, 'gameOver.restart'), () => {
            this.scene.stop('Game');
            this.scene.stop();
            this.scene.start('Game');
        });

        this.createMenuButton(centerX + spacing, buttonY, 'menu-exit', 'menu-exit-hover', t(this, 'gameOver.mainMenu'), () => {
            stopLevelMusic(this);
            this.scene.stop('Game');
            this.scene.stop();
            this.scene.start('MainMenu');
        });
    }

    private createMenuButton(
        x: number,
        y: number,
        normalTexture: string,
        hoverTexture: string,
        label: string,
        onClick: () => void
    )
    {
        const button = this.add.image(x, y, normalTexture)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });

        this.add.text(x, y + 82, label, {
            fontFamily: 'Arial Black',
            fontSize: 22,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
            wordWrap: { width: 220 }
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            playUiHover(this, `game-over-${normalTexture}`);
            button.setTexture(hoverTexture);
        });

        button.on('pointerout', () => {
            button.setTexture(normalTexture);
        });

        button.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });
    }
}
