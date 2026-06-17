import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { translate as t } from '../i18n';
import { createPlayerAnimations } from './PlayerAnimations';
import {
    getAnimationKey,
    getFrameKey,
    PLAYER_CHARACTERS,
    type PlayerCharacterConfig
} from './PlayerCharacters';

export class CharacterMenu extends Scene
{
    background!: GameObjects.Image;
    title!: GameObjects.Text;

    constructor ()
    {
        super('CharacterMenu');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        stopLevelMusic(this);
        createPlayerAnimations(this);
        this.createBackground(width, height);

        this.title = this.add.text(width / 2, height * 0.16, t(this, 'character.title'), {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const spacing = Math.min(280, width * 0.26);
        const centerY = height * 0.52;
        const startX = width / 2 - spacing * (PLAYER_CHARACTERS.length - 1) / 2;

        PLAYER_CHARACTERS.forEach((character, index) => {
            this.createCharacterOption(startX + index * spacing, centerY, character);
        });

        this.createMenuButton(width / 2, height * 0.84, 'menu-exit', 'menu-exit-hover', t(this, 'common.back'), () => {
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

    private createCharacterOption(x: number, y: number, character: PlayerCharacterConfig)
    {
        const panel = this.add.rectangle(x, y, 220, 300, 0x000000, 0.25)
            .setStrokeStyle(4, 0xffffff, 0.8)
            .setInteractive({ useHandCursor: true });

        const previewX = x + (character.menuOffsetX ?? 0);
        const previewY = y + 42 + (character.menuOffsetY ?? 0);

        const preview = this.add.sprite(previewX, previewY, getFrameKey(character.id, 'idle', 1))
            .setOrigin(0.5, 1)
            .setScale(character.menuScale)
            .setInteractive({ useHandCursor: true });

        preview.play(getAnimationKey(character.id, 'idle'));

        this.add.text(x, y + 106, t(this, character.labelKey), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const choose = () => {
            this.registry.set('selectedCharacter', character.id);
            this.scene.start('LevelMenu');
        };

        const setHover = (active: boolean) => {
            panel.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.8);
            preview.setScale(character.menuScale * (active ? 1.08 : 1));
        };

        panel.on('pointerover', () => setHover(true));
        panel.on('pointerout', () => setHover(false));
        panel.on('pointerdown', choose);

        preview.on('pointerover', () => setHover(true));
        preview.on('pointerout', () => setHover(false));
        preview.on('pointerdown', choose);
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
