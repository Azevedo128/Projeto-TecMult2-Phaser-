import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    ground: Phaser.GameObjects.Rectangle;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xffffff);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        // Chão do jogo
        this.ground = this.add.rectangle(512, 700, 1024, 200, 0x654321);

        // Dá física ao chão e torna-o estático
        this.physics.add.existing(this.ground, true);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}