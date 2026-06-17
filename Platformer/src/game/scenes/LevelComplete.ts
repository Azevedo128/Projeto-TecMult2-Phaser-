import { Scene, GameObjects } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { translate as t } from '../i18n';
import { playUiClick, playUiHover } from './UiSounds';

const LAST_LEVEL = 3;

export class LevelComplete extends Scene
{
    title!: GameObjects.Text;

    constructor ()
    {
        super('LevelComplete');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const panelWidth = Math.min(820, width * 0.9);
        const panelHeight = 460;
        const centerX = width / 2;
        const centerY = height / 2;
        const selectedLevel = Number(this.registry.get('selectedLevel') ?? 1);
        const hasNextLevel = selectedLevel < LAST_LEVEL;

        this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.56)
            .setInteractive();

        this.add.rectangle(centerX, centerY, panelWidth, panelHeight, 0x10131b, 0.92)
            .setStrokeStyle(5, 0xffffff, 0.75);

        this.title = this.add.text(centerX, centerY - 150, t(this, 'levelComplete.title'), {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            wordWrap: { width: panelWidth - 80 }
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 82, t(this, 'levelComplete.subtitle'), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
            wordWrap: { width: panelWidth - 100 }
        }).setOrigin(0.5);

        const buttonY = centerY + 60;

        if (hasNextLevel)
        {
            const spacing = Math.min(230, panelWidth * 0.3);

            this.createMenuButton(centerX - spacing, buttonY, 'menu-restart', 'menu-restart-hover', t(this, 'levelComplete.retry'), () => {
                this.restartLevel();
            });

            this.createMenuButton(centerX, buttonY, 'menu-play', 'menu-play-hover', t(this, 'levelComplete.next'), () => {
                this.startNextLevel(selectedLevel);
            });

            this.createMenuButton(centerX + spacing, buttonY, 'menu-exit', 'menu-exit-hover', t(this, 'levelComplete.levelMenu'), () => {
                this.exitToLevelMenu();
            });

            return;
        }

        const spacing = Math.min(180, panelWidth * 0.24);

        this.createMenuButton(centerX - spacing, buttonY, 'menu-restart', 'menu-restart-hover', t(this, 'levelComplete.retry'), () => {
            this.restartLevel();
        });

        this.createMenuButton(centerX + spacing, buttonY, 'menu-exit', 'menu-exit-hover', t(this, 'levelComplete.levelMenu'), () => {
            this.exitToLevelMenu();
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
            .setScale(0.45)
            .setInteractive({ useHandCursor: true });

        this.add.text(x, y + 88, label, {
            fontFamily: 'Arial Black',
            fontSize: 21,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
            wordWrap: { width: 200 }
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            playUiHover(this, `level-complete-${normalTexture}`);
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

    private restartLevel()
    {
        this.scene.stop('Game');
        this.scene.stop();
        this.scene.start('Game');
    }

    private startNextLevel(currentLevel: number)
    {
        this.registry.set('selectedLevel', currentLevel + 1);
        this.scene.stop('Game');
        this.scene.stop();
        this.scene.start('Game');
    }

    private exitToLevelMenu()
    {
        stopLevelMusic(this);
        this.scene.stop('Game');
        this.scene.stop();
        this.scene.start('LevelMenu');
    }
}
