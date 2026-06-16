import { Scene } from 'phaser';
import { createPlayerAnimations } from './PlayerAnimations';
import { createLevel1 } from './Levels/level1';
import { createLevel2 } from './Levels/level2';
import { GameUI } from './GameUI';
import { PlayerController } from './PlayerController';
import { getPlayerCharacter } from './PlayerCharacters';
import { playLevelMusic, stopLevelMusic } from './AudioManager';
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
    isPlayerDying = false;
    platformCollider?: Phaser.Physics.Arcade.Collider;
    hazardOverlap?: Phaser.Physics.Arcade.Collider;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setZoom(0.8);
        this.camera.setBackgroundColor(0x00ff00);
        this.physics.world.drawDebug = Boolean(this.registry.get('showHitboxes'));
        playLevelMusic(this);

        if (this.physics.world.debugGraphic)
        {
            this.physics.world.debugGraphic.clear();
        }

        const selectedLevel = Number(this.registry.get('selectedLevel') ?? 1);
        const level = selectedLevel === 2 ? createLevel2(this) : createLevel1(this);

        this.worldHeight = level.worldHeight;
        this.spawnX = level.spawnX;
        this.spawnY = level.spawnY;
        this.lives = this.maxLives;

        createPlayerAnimations(this);

        const selectedCharacter = getPlayerCharacter(this.registry.get('selectedCharacter'));

        this.player = new PlayerController(this, this.spawnX, this.spawnY, selectedCharacter.id);

        this.platformCollider = this.physics.add.collider(this.player.sprite, level.platforms);

        if ('hazards' in level)
        {
            this.hazardOverlap = this.physics.add.overlap(this.player.sprite, level.hazards, () => {
                this.startObstacleDeath();
            });
        }

        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

        this.ui = new GameUI(this, this.camera, this.maxLives, () => this.openPauseMenu());
        this.ui.setLives(this.lives);

        this.input.keyboard?.on('keydown-ESC', () => {
            this.openPauseMenu();
        });
    }

    update ()
    {
        this.player.update();
        this.ui.update();

        if (this.isPlayerDying)
        {
            if (this.player.sprite.y > this.worldHeight + 100)
            {
                this.finishObstacleDeath();
            }

            return;
        }

        if (this.player.sprite.y > this.worldHeight + 100)
        {
            this.damagePlayer();
        }
    }

    damagePlayer()
    {
        if (this.isPlayerDying)
        {
            return;
        }

        this.lives--;
        this.ui.setLives(this.lives);

        if (this.lives <= 0)
        {
            stopLevelMusic(this);
            this.scene.start('GameOver');
            return;
        }

        this.player.respawn(this.spawnX, this.spawnY);
    }

    startObstacleDeath()
    {
        if (this.isPlayerDying)
        {
            return;
        }

        if (!this.getDeathAnimationEnabled())
        {
            this.damagePlayer();
            return;
        }

        this.isPlayerDying = true;
        this.lives--;
        this.ui.setLives(this.lives);
        this.setPlayerCollidersActive(false);
        this.player.startDeath();
    }

    finishObstacleDeath()
    {
        if (this.lives <= 0)
        {
            stopLevelMusic(this);
            this.scene.start('GameOver');
            return;
        }

        this.player.respawn(this.spawnX, this.spawnY);
        this.isPlayerDying = false;
        this.setPlayerCollidersActive(true);
    }

    setPlayerCollidersActive(active: boolean)
    {
        if (this.platformCollider)
        {
            this.platformCollider.active = active;
        }

        if (this.hazardOverlap)
        {
            this.hazardOverlap.active = active;
        }
    }

    getDeathAnimationEnabled()
    {
        const value = this.registry.get('deathAnimationEnabled');

        return typeof value === 'boolean' ? value : true;
    }

    openPauseMenu()
    {
        if (this.isPlayerDying)
        {
            return;
        }

        if (this.scene.isActive('PauseMenu') || this.scene.isActive('OptionsOverlay'))
        {
            return;
        }

        this.scene.launch('PauseMenu');
        this.scene.bringToTop('PauseMenu');
        this.scene.pause('Game');
    }
}
