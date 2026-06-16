import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';

export class GameOver extends Scene
{
    background!: GameObjects.Image;
    title!: GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        stopLevelMusic(this);
        this.createBackground(width, height);

        this.add.rectangle(width / 2, height / 2, Math.min(620, width * 0.82), 430, 0x000000, 0.38)
            .setStrokeStyle(5, 0xffffff, 0.75);

        this.title = this.add.text(width / 2, height * 0.32, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 9,
            align: 'center'
        }).setOrigin(0.5);

        const buttonY = height * 0.55;
        const spacing = Math.min(190, width * 0.24);

        this.createMenuButton(width / 2 - spacing, buttonY, 'menu-play', 'menu-play-hover', 'Recomecar', () => {
            this.scene.start('Game');
        });

        this.createMenuButton(width / 2 + spacing, buttonY, 'menu-exit', 'menu-exit-hover', 'Menu Principal', () => {
            this.scene.start('MainMenu');
        });
    }

    private createBackground(width: number, height: number)
    {
        this.background = this.add.image(width / 2, height / 2, 'map-bg');

        const scaleX = width / this.background.width;
        const scaleY = height / this.background.height;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);
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
            button.setTexture(hoverTexture);
        });

        button.on('pointerout', () => {
            button.setTexture(normalTexture);
        });

        button.on('pointerdown', onClick);
    }
}
