import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        this.background = this.add.image(width / 2, height / 2, 'map-bg');

        const scaleX = width / this.background.width;
        const scaleY = height / this.background.height;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);

        this.logo = this.add.image(width / 2, height * 0.24, 'logo')
            .setScale(0.75);

        this.title = this.add.text(width / 2, height * 0.42, 'Platformer', {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const buttonY = height * 0.62;
        const spacing = 170;

        this.createMenuButton(width / 2 - spacing, buttonY, 'menu-play', 'menu-play-hover', 'Jogar', () => {
            this.scene.start('CharacterMenu');
        });

        this.createMenuButton(width / 2, buttonY, 'menu-settings', 'menu-settings-hover', 'Opcoes', () => {
            this.scene.launch('OptionsOverlay', { returnScene: 'MainMenu' });
            this.scene.bringToTop('OptionsOverlay');
            this.scene.pause('MainMenu');
        });

        this.createMenuButton(width / 2 + spacing, buttonY, 'menu-exit', 'menu-exit-hover', 'Sair', () => {
            this.closeCurrentPage();
        });
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
            fontSize: 22,
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

    closeCurrentPage()
    {
        window.close();

        this.time.delayedCall(250, () => {
            if (!window.closed)
            {
                window.location.replace('about:blank');
            }
        });
    }
}
