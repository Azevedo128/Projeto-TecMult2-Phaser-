import { Scene } from 'phaser';
import { createPlayerAnimations } from './PlayerAnimations';
import { createLevel1 } from './Levels/level1';
import { createLevel2 } from './Levels/level2';
import { GameUI } from './GameUI';
import { PlayerController } from './PlayerController';
import { getPlayerCharacter } from './PlayerCharacters';
export class Game extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    player!: PlayerController;
    ui!: GameUI;
    lives = 3;
    maxLives = 3;
    spawnX = 0;
    spawnY = 0;
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

        const selectedLevel = Number(this.registry.get('selectedLevel') ?? 1);
        const level = selectedLevel === 2 ? createLevel2(this) : createLevel1(this);

        this.worldHeight = level.worldHeight;
        this.spawnX = level.spawnX;
        this.spawnY = level.spawnY;
        this.lives = this.maxLives;

        createPlayerAnimations(this);

        const selectedCharacter = getPlayerCharacter(this.registry.get('selectedCharacter'));

        this.player = new PlayerController(this, this.spawnX, this.spawnY, selectedCharacter.id);

        this.physics.add.collider(this.player.sprite, level.platforms);

        if ('hazards' in level)
        {
            this.physics.add.overlap(this.player.sprite, level.hazards, () => {
                this.damagePlayer();
            });
        }

        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

        this.ui = new GameUI(this, this.camera, this.maxLives);
        this.ui.setLives(this.lives);
    }

    update ()
    {
        this.player.update();
        this.ui.update();

        if (this.player.sprite.y > this.worldHeight + 100)
        {
            this.damagePlayer();
        }
    }

    damagePlayer()
    {
        this.lives--;
        this.ui.setLives(this.lives);

        if (this.lives <= 0)
        {
            this.scene.start('GameOver');
            return;
        }

        this.player.respawn(this.spawnX, this.spawnY);
    }
}
