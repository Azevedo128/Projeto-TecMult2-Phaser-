import { Scene } from 'phaser';
import { createDinoAnimations } from './PlayerAnimations';
import { createLevel1 } from './Levels/level1';
import { PlayerController } from './PlayerController';
export class Game extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    player!: PlayerController;
    worldHeight = 0;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setZoom(0.8);
        this.camera.setBackgroundColor(0x00ff00);

        const level = createLevel1(this);

        this.worldHeight = level.worldHeight;

        createDinoAnimations(this);

        this.player = new PlayerController(this, level.spawnX, level.spawnY);

        this.physics.add.collider(this.player.sprite, level.platforms);

        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    }

    update ()
    {
        this.player.update();

        if (this.player.sprite.y > this.worldHeight + 100)
        {
            this.scene.start('GameOver');
        }
    }
}