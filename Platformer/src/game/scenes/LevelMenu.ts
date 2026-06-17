import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { translate as t } from '../i18n';

export class LevelMenu extends Scene
{
    background!: GameObjects.Image;
    title!: GameObjects.Text;
    subtitle!: GameObjects.Text;

    constructor ()
    {
        super('LevelMenu');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        stopLevelMusic(this);
        this.background = this.add.image(width / 2, height / 2, 'map-bg');

        const scaleX = width / this.background.width;
        const scaleY = height / this.background.height;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);

        this.title = this.add.text(width / 2, height * 0.18, t(this, 'levels.title'), {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.subtitle = this.add.text(width / 2, height * 0.28, t(this, 'levels.subtitle'), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const levelY = height * 0.52;
        const spacing = 210;

        this.createLevelButton(width / 2 - spacing, levelY, t(this, 'levels.level1'), 'menu-play', 'menu-play-hover', true, () => {
            this.registry.set('selectedLevel', 1);
            this.scene.start('Game');
        });

        this.createLevelButton(width / 2, levelY, t(this, 'levels.level2'), 'menu-play', 'menu-play-hover', true, () => {
            this.registry.set('selectedLevel', 2);
            this.scene.start('Game');
        });

        this.createLevelButton(width / 2 + spacing, levelY, t(this, 'levels.level3'), 'menu-locked', 'menu-locked', false, () => {});

        this.createMenuButton(width / 2, height * 0.82, 'menu-exit', 'menu-exit-hover', t(this, 'common.back'), () => {
            this.scene.start('CharacterMenu');
        });
    }

    createLevelButton(
        x: number,
        y: number,
        label: string,
        normalTexture: string,
        hoverTexture: string,
        unlocked: boolean,
        onClick: () => void
    )
    {
        const button = this.add.image(x, y, normalTexture)
            .setScale(0.5);

        if (unlocked)
        {
            button.setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setTexture(hoverTexture);
            });

            button.on('pointerout', () => {
                button.setTexture(normalTexture);
            });

            button.on('pointerdown', onClick);
        }
        else
        {
            button.setAlpha(0.85);
        }

        this.add.text(x, y + 82, label, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        if (!unlocked)
        {
            this.add.text(x, y + 112, t(this, 'levels.locked'), {
                fontFamily: 'Arial Black',
                fontSize: 16,
                color: '#d9d9d9',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);
        }
    }

    createMenuButton(
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

        this.add.text(x, y + 80, label, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
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
