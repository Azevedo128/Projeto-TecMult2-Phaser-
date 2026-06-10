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

        this.background = this.add.image(width / 2, height / 2, 'background')
            .setDisplaySize(width, height);

        this.logo = this.add.image(width / 2, height * 0.38, 'logo');

        this.title = this.add.text(width / 2, height * 0.6, 'Main Menu', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.title.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}